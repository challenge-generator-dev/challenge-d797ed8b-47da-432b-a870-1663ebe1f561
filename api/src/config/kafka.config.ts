import { ConfigService } from '@nestjs/config';

export interface KafkaSaslConfig {
  mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
  username: string;
  password: string;
}

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
  topics: {
    orderEvents: string;
  };
  ssl: boolean;
  sasl?: KafkaSaslConfig;
  retry: {
    initialRetryTime: number;
    retries: number;
  };
}

export const kafkaConfig: KafkaConfig = {
  clientId: 'order-tracking-api',
  brokers: ['localhost:9092'],
  groupId: 'order-tracking-consumer-group',
  topics: {
    orderEvents: 'order-events',
  },
  ssl: false,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
};

export function getKafkaConfig(configService: ConfigService): KafkaConfig {
  const brokersEnv = configService.get<string>('KAFKA_BROKERS');
  const brokers = brokersEnv 
    ? brokersEnv.split(',').map(b => b.trim())
    : kafkaConfig.brokers;

  const saslEnabled = configService.get<boolean>('KAFKA_SASL_ENABLED', false);
  
  return {
    clientId: configService.get<string>('KAFKA_CLIENT_ID', kafkaConfig.clientId),
    brokers,
    groupId: configService.get<string>('KAFKA_GROUP_ID', kafkaConfig.groupId),
    topics: {
      orderEvents: configService.get<string>('KAFKA_TOPIC_ORDERS', kafkaConfig.topics.orderEvents),
    },
    ssl: configService.get<boolean>('KAFKA_SSL', kafkaConfig.ssl),
    sasl: saslEnabled ? {
      mechanism: configService.get<string>('KAFKA_SASL_MECHANISM', 'plain') as KafkaSaslConfig['mechanism'],
      username: configService.get<string>('KAFKA_SASL_USERNAME', ''),
      password: configService.get<string>('KAFKA_SASL_PASSWORD', ''),
    } : undefined,
    retry: {
      initialRetryTime: configService.get<number>('KAFKA_RETRY_INITIAL_TIME', kafkaConfig.retry.initialRetryTime),
      retries: configService.get<number>('KAFKA_RETRY_RETRIES', kafkaConfig.retry.retries),
    },
  };
}

export function validateKafkaConfig(config: KafkaConfig): string[] {
  const errors: string[] = [];

  if (!config.clientId || config.clientId.trim() === '') {
    errors.push('KAFKA_CLIENT_ID es requerido');
  }

  if (!config.brokers || config.brokers.length === 0) {
    errors.push('Al menos un broker de Kafka es requerido');
  }

  for (const broker of config.brokers) {
    if (!broker.includes(':')) {
      errors.push(`Broker inválido: ${broker}. Formato esperado: host:port`);
    }
  }

  if (!config.groupId || config.groupId.trim() === '') {
    errors.push('KAFKA_GROUP_ID es requerido');
  }

  if (!config.topics.orderEvents || config.topics.orderEvents.trim() === '') {
    errors.push('El topic de eventos de órdenes es requerido');
  }

  if (config.sasl) {
    if (!config.sasl.mechanism) {
      errors.push('Mecanismo SASL es requerido cuando SASL está habilitado');
    }
    if (!config.sasl.username || config.sasl.username.trim() === '') {
      errors.push('Usuario SASL es requerido cuando SASL está habilitado');
    }
    if (!config.sasl.password || config.sasl.password.trim() === '') {
      errors.push('Contraseña SASL es requerida cuando SASL está habilitado');
    }
  }

  return errors;
}