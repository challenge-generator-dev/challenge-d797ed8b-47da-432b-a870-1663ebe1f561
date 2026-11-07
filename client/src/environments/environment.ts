export const environment = {
  production: false,
  api: {
    baseUrl: 'http://localhost:3000',
    endpoints: {
      orderEvents: '/api/orders/events'
    },
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  kafka: {
    consumer: {
      groupId: 'order-tracking-client',
      autoOffsetReset: 'latest',
      enableAutoCommit: true,
      sessionTimeoutMs: 30000,
      heartbeatIntervalMs: 3000
    },
    producer: {
      acks: 'all',
      retries: 3,
      maxInFlightRequests: 1,
      transactionTimeoutMs: 30000
    },
    topics: {
      orders: 'order-events',
      orderUpdates: 'order-updates'
    },
    connection: {
      bootstrapServers: 'localhost:9092',
      clientId: 'order-tracking-frontend',
      reconnectBackoffMs: 1000,
      reconnectBackoffMaxMs: 10000
    }
  },
  sse: {
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
    eventSourceReadyStateCheckInterval: 3000
  },
  ui: {
    pollingInterval: 5000,
    maxDisplayedEvents: 100,
    notificationDuration: 5000,
    animationDuration: 300
  },
  features: {
    enableRealTimeUpdates: true,
    enableNotifications: true,
    enableSoundAlerts: false,
    enableDarkMode: false,
    debugMode: true
  },
  logging: {
    level: 'debug',
    enableConsole: true,
    enableRemote: false,
    remoteEndpoint: ''
  },
  cache: {
    enableLocalCache: true,
    maxCacheSize: 50,
    cacheTtl: 300000
  }
};

export type EnvironmentConfig = typeof environment;

export function isProduction(): boolean {
  return environment.production;
}

export function getApiUrl(): string {
  return environment.api.baseUrl;
}

export function getOrderEventsEndpoint(): string {
  return `${environment.api.baseUrl}${environment.api.endpoints.orderEvents}`;
}

export function isRealTimeEnabled(): boolean {
  return environment.features.enableRealTimeUpdates;
}

export function getKafkaConfig() {
  return environment.kafka;
}

export function getSSERetryConfig() {
  return {
    maxAttempts: environment.sse.maxReconnectAttempts,
    interval: environment.sse.reconnectInterval
  };
}

export function getLoggingLevel(): string {
  return environment.logging.level;
}