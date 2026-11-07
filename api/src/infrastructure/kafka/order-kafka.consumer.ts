import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { kafkaConfig } from '../../config/kafka.config';
import { OrderEvent, OrderEventType } from '../../domain/ports/order-publisher.port';

@Injectable()
export class OrderKafkaConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderKafkaConsumer.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
      ssl: kafkaConfig.ssl,
      sasl: kafkaConfig.sasl?.mechanism ? {
        mechanism: kafkaConfig.sasl.mechanism,
        username: kafkaConfig.sasl.username,
        password: kafkaConfig.sasl.password,
      } : undefined,
    });

    this.consumer = this.kafka.consumer({
      groupId: kafkaConfig.groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    await this.subscribeToTopic();
    await this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log('Conectado al broker de Kafka');
    } catch (error) {
      this.logger.error('Error al conectar con Kafka', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.consumer.disconnect();
      this.isConnected = false;
      this.logger.log('Desconectado del broker de Kafka');
    }
  }

  private async subscribeToTopic(): Promise<void> {
    await this.consumer.subscribe({
      topic: kafkaConfig.topics.orderEvents,
      fromBeginning: false,
    });
    this.logger.log(`Suscrito al topic: ${kafkaConfig.topics.orderEvents}`);
  }

  private async startConsuming(): Promise<void> {
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    
    if (!message.value) {
      this.logger.warn(`Mensaje sin valor en ${topic}[${partition}]`);
      return;
    }

    try {
      const eventData = JSON.parse(message.value.toString());
      const orderEvent = this.mapToOrderEvent(eventData);
      
      await this.processOrderEvent(orderEvent);
      
      this.logger.log(
        `Evento procesado: ${orderEvent.type} para orden ${orderEvent.orderId}`
      );
    } catch (error) {
      this.logger.error(
        `Error al procesar mensaje de ${topic}[${partition}]`,
        error
      );
    }
  }

  private mapToOrderEvent(eventData: Record<string, unknown>): OrderEvent {
    const eventType = eventData.type as OrderEventType;
    
    return new OrderEvent(
      eventData.orderId as string,
      eventType,
      eventData.payload
    );
  }

  private async processOrderEvent(event: OrderEvent): Promise<void> {
    switch (event.type) {
      case OrderEventType.ORDER_CREATED:
        await this.handleOrderCreated(event);
        break;
      case OrderEventType.ORDER_UPDATED:
        await this.handleOrderUpdated(event);
        break;
      case OrderEventType.ORDER_CANCELLED:
        await this.handleOrderCancelled(event);
        break;
      case OrderEventType.ORDER_COMPLETED:
        await this.handleOrderCompleted(event);
        break;
      default:
        this.logger.warn(`Tipo de evento desconocido: ${event.type}`);
    }
  }

  private async handleOrderCreated(event: OrderEvent): Promise<void> {
    this.logger.log(
      `Procesando orden creada: ${event.orderId}`
    );
  }

  private async handleOrderUpdated(event: OrderEvent): Promise<void> {
    this.logger.log(
      `Procesando orden actualizada: ${event.orderId}`
    );
  }

  private async handleOrderCancelled(event: OrderEvent): Promise<void> {
    this.logger.log(
      `Procesando orden cancelada: ${event.orderId}`
    );
  }

  private async handleOrderCompleted(event: OrderEvent): Promise<void> {
    this.logger.log(
      `Procesando orden completada: ${event.orderId}`
    );
  }

  public async pause(): Promise<void> {
    await this.consumer.pause([{ topic: kafkaConfig.topics.orderEvents }]);
    this.logger.log('Consumo de mensajes pausado');
  }

  public async resume(): Promise<void> {
    await this.consumer.resume([{ topic: kafkaConfig.topics.orderEvents }]);
    this.logger.log('Consumo de mensajes reanudado');
  }

  public isRunning(): boolean {
    return this.isConnected;
  }
}