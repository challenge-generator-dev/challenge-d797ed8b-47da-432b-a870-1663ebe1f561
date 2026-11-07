import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Partitioners } from 'kafkajs';
import { OrderKafkaPublisher } from './order-kafka.publisher';

@Global()
@Module({
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async (configService: ConfigService): Promise<Producer> => {
        const kafka = new Kafka({
          clientId: configService.get<string>('KAFKA_CLIENT_ID', 'order-tracking-api'),
          brokers: configService.get<string[]>('KAFKA_BROKERS', ['localhost:9092']),
          ssl: configService.get<boolean>('KAFKA_SSL', false),
          sasl: configService.get<boolean>('KAFKA_SASL_ENABLED', false)
            ? {
                mechanism: configService.get<string>('KAFKA_SASL_MECHANISM', 'plain'),
                username: configService.get<string>('KAFKA_SASL_USERNAME', ''),
                password: configService.get<string>('KAFKA_SASL_PASSWORD', ''),
              }
            : undefined,
        });

        const producer = kafka.producer({
          createPartitioner: Partitioners.LegacyPartitioner,
          allowAutoTopicCreation: false,
          transactionTimeout: 30000,
        });

        await producer.connect();
        return producer;
      },
      inject: [ConfigService],
    },
    OrderKafkaPublisher,
  ],
  exports: ['KAFKA_PRODUCER', OrderKafkaPublisher],
})
export class KafkaModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly producer: Producer) {}

  async onModuleInit(): Promise<void> {
    const topic = 'order-events';
    const admin = this.producer.kafka.admin();
    
    try {
      await admin.connect();
      const metadata = await admin.fetchTopicMetadata({ topics: [topic] });
      
      if (!metadata.topics.some(t => t.name === topic)) {
        await admin.createTopics({
          topics: [
            {
              topic,
              numPartitions: 3,
              replicationFactor: 1,
              configEntries: [
                { name: 'cleanup.policy', value: 'delete' },
                { name: 'retention.ms', value: '604800000' },
              ],
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error initializing Kafka topic:', error);
    } finally {
      await admin.disconnect();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
  }
}