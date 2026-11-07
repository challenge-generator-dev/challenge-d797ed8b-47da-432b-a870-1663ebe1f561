import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/order.service';
import { OrderPublisherPort } from './domain/ports/order-publisher.port';
import { KafkaModule } from './infrastructure/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config: Record<string, string>) => {
        if (!config['KAFKA_BROKER']) {
          throw new Error('KAFKA_BROKER environment variable is required');
        }
        if (!config['KAFKA_CLIENT_ID']) {
          throw new Error('KAFKA_CLIENT_ID environment variable is required');
        }
        if (!config['KAFKA_GROUP_ID']) {
          throw new Error('KAFKA_GROUP_ID environment variable is required');
        }
        return config;
      },
    }),
    KafkaModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: OrderPublisherPort,
      useFactory: (kafkaModule: typeof KafkaModule) => {
        return kafkaModule;
      },
      inject: [KafkaModule],
    },
  ],
  exports: [OrderService],
})
export class AppModule {}