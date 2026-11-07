import { Injectable, Inject, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Producer } from 'kafkajs';
import { OrderPublisherPort, OrderEvent, OrderEventType } from '../../domain/ports/order-publisher.port';

@Injectable()
export class OrderKafkaPublisher implements OrderPublisherPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderKafkaPublisher.name);
  private readonly topicName: string;
  private isConnected = false;

  constructor(
    @Inject('KAFKA_PRODUCER') private readonly producer: Producer,
    private readonly configService: ConfigService,
  ) {
    this.topicName = this.configService.get<string>('KAFKA_TOPIC', 'order-events');
  }

  async onModuleInit(): Promise<void> {
    this.isConnected = true;
    this.logger.log(`Kafka publisher initialized for topic: ${this.topicName}`);
  }

  async onModuleDestroy(): Promise<void> {
    this.isConnected = false;
    this.logger.log('Kafka publisher disconnected');
  }

  async publish(event: OrderEvent): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka producer is not connected');
    }

    const message = this.buildMessage(event);
    
    try {
      await this.producer.send({
        topic: this.topicName,
        messages: [message],
        acks: -1,
        timeout: 30000,
      });
      
      this.logger.log(`Order event published: ${event.type} for order ${event.orderId}`);
    } catch (error) {
      this.logger.error(
        `Failed to publish order event: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async publishBatch(events: OrderEvent[]): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka producer is not connected');
    }

    const messages = events.map(event => this.buildMessage(event));
    
    try {
      await this.producer.send({
        topic: this.topicName,
        messages,
        acks: -1,
        timeout: 30000,
      });
      
      this.logger.log(`Batch of ${events.length} order events published`);
    } catch (error) {
      this.logger.error(
        `Failed to publish batch: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  private buildMessage(event: OrderEvent): { key: string; value: string; headers: Record<string, string> } {
    return {
      key: event.orderId,
      value: JSON.stringify({
        orderId: event.orderId,
        type: event.type,
        payload: event.payload,
        timestamp: event.timestamp,
        correlationId: event.correlationId,
      }),
      headers: {
        'event-type': event.type,
        'content-type': 'application/json',
      },
    };
  }
}