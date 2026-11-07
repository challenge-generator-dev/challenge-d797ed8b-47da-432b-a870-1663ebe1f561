# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `GET /api/orders/events`
  - `POST /api/orders/events`

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/domain/order.model.ts` — `OrderItem.reduce`: Se invoca `reduce` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/application/order.service.ts` — `OrderItem.map`: Se invoca `map` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/application/order.service.ts` — `OrderItem.every`: Se invoca `every` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/kafka/order-kafka.publisher.ts` — `OrderEvent.map`: Se invoca `map` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/app/app.component.ts` — `NavItem.filter`: Se invoca `filter` sobre `NavItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2

### Brecha de conocimiento
Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261106212220607), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz

### Misión / candidato
Mostrar en vivo el estado de las ordenes

### Reto
- Tema: Consumo de eventos en tiempo real con Kafka
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de una interfaz de seguimiento de órdenes en tiempo real
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración del entorno de Kafka — objetivo: Preparar el entorno para la publicación y consumo de eventos en Kafka. — entregable (NO resolver): Entorno de Kafka configurado y topic de órdenes creado.
- Fase 2: Publicación de eventos en Kafka — objetivo: Implementar la funcionalidad para publicar eventos de órdenes en el topic de Kafka. — entregable (NO resolver): Servicio que publica eventos de órdenes en Kafka.
- Fase 3: Consumo de eventos y actualización de la interfaz — objetivo: Consumir eventos de Kafka y reflejar los cambios en la interfaz de usuario en tiempo real. — entregable (NO resolver): Consumidor de eventos de Kafka que actualiza la interfaz de usuario.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-tracking-api",
  "version": "1.0.0",
  "description": "API para seguimiento de órdenes en tiempo real usando Kafka",
  "main": "dist/main.js",
  "scripts": {
    "build": "rimraf dist && tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "node dist/main.js",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/config": "^3.1.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/swagger": "^7.1.13",
    "@nestjs/websockets": "^11.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "kafkajs": "^2.2.4",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.5",
    "@types/node": "^20.8.0",
    "@types/supertest": "^2.0.14",
    "@typescript-eslint/eslint-plugin": "^6.7.0",
    "@typescript-eslint/parser": "^6.7.0",
    "eslint": "^8.50.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.7.0",
    "prettier": "^3.0.3",
    "rimraf": "^5.0.5",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-loader": "^9.4.4",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.2.2"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}


// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2017",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const config = new DocumentBuilder()
    .setTitle('Order Tracking API')
    .setDescription('API para seguimiento de órdenes en tiempo real')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

// === ARCHIVO: api/src/domain/order.model.ts ===
import { OrderStatus } from './order-status.enum';

export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly quantity: number,
    public readonly price: number
  ) {}

  getTotalPrice(): number {
    return this.quantity * this.price;
  }

  equals(other: OrderItem): boolean {
    return (
      other.productId === this.productId &&
      other.name === this.name &&
      other.quantity === this.quantity &&
      other.price === this.price
    );
  }
}

export class Order {
  public readonly id: string;
  public readonly customerId: string;
  public readonly items: OrderItem[];
  public status: OrderStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    customerId: string,
    items: OrderItem[],
    status: OrderStatus = OrderStatus.PENDING
  ) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.status = status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  getTotalAmount(): number {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  canTransitionTo(newStatus: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: []
    };

    return validTransitions[this.status].includes(newStatus);
  }

  transitionTo(newStatus: OrderStatus): void {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(
        `Invalid status transition from ${this.status} to ${newStatus}`
      );
    }
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  hasItems(): boolean {
    return this.items.length > 0;
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
}

// === ARCHIVO: api/src/domain/ports/order-publisher.port.ts ===
/**
 * Puerto para publicar eventos de órdenes.
 * Define la interfaz que la infraestructura debe implementar para publicar eventos.
 */
export interface OrderPublisherPort {
    /**
     * Publica un evento de orden.
     * @param event Evento a publicar.
     */
    publish(event: OrderEvent): Promise<void>;
}

/**
 * Evento de orden.
 */
export class OrderEvent {
    constructor(
        public readonly orderId: string,
        public readonly type: OrderEventType,
        public readonly payload: unknown,
        public readonly timestamp: Date = new Date(),
    ) {}
}

/**
 * Tipos de eventos de orden.
 */
export enum OrderEventType {
    CREATED = 'ORDER_CREATED',
    UPDATED = 'ORDER_UPDATED',
    CANCELLED = 'ORDER_CANCELLED',
}

// === ARCHIVO: api/src/common/dto/order-event.dto.ts ===
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderEventType } from '../../domain/ports/order-publisher.port';

/**
 * DTO para representar un evento de orden.
 */
export class OrderEventDto {
    @IsString()
    @IsNotEmpty()
    readonly orderId: string;

    @IsEnum(OrderEventType)
    readonly type: OrderEventType;

    @ValidateNested()
    @Type(() => Object)
    readonly payload: unknown;

    constructor(orderId: string, type: OrderEventType, payload: unknown) {
        this.orderId = orderId;
        this.type = type;
        this.payload = payload;
    }
}

/**
 * DTO para el payload de evento ORDER_CREATED.
 */
export class OrderCreatedPayloadDto {
    @IsString()
    @IsNotEmpty()
    readonly customerId: string;

    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    readonly items: OrderItemDto[];
}

/**
 * DTO para representar un ítem de orden.
 */
export class OrderItemDto {
    @IsString()
    @IsNotEmpty()
    readonly productId: string;

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly quantity: number;

    @IsNotEmpty()
    readonly price: number;
}

/**
 * DTO para el payload de evento ORDER_UPDATED.
 */
export class OrderUpdatedPayloadDto {
    @IsString()
    @IsNotEmpty()
    readonly newStatus: string;
}

// === ARCHIVO: api/src/app.module.ts ===
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

// === ARCHIVO: api/src/application/order.service.ts ===
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Order, OrderItem } from '../domain/order.model';
import { OrderStatus } from '../domain/order-status.enum';
import { OrderPublisherPort } from '../domain/ports/order-publisher.port';
import { OrderEvent, OrderEventType } from '../domain/ports/order-publisher.port';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private readonly orders: Map<string, Order> = new Map();

  constructor(private readonly orderPublisher: OrderPublisherPort) {}

  async createOrder(customerId: string, items: OrderItem[]): Promise<Order> {
    if (!customerId || customerId.trim() === '') {
      throw new BadRequestException('Customer ID is required');
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    const orderId = this.generateOrderId();
    const order = new Order(orderId, customerId, items, OrderStatus.PENDING);

    this.orders.set(orderId, order);
    this.logger.log(`Order created: ${orderId}`);

    await this.publishEvent(order, OrderEventType.ORDER_CREATED, {
      customerId: order.customerId,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    });

    return order;
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    const order = this.orders.get(orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (!order.canTransitionTo(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${newStatus}`
      );
    }

    const previousStatus = order.status;
    order.transitionTo(newStatus);
    this.logger.log(
      `Order ${orderId} status changed: ${previousStatus} -> ${newStatus}`
    );

    await this.publishEvent(order, OrderEventType.ORDER_UPDATED, {
      previousStatus,
      newStatus: newStatus
    });

    return order;
  }

  async getOrder(orderId: string): Promise<Order> {
    const order = this.orders.get(orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async publishEvent(
    order: Order,
    type: OrderEventType,
    payload: unknown
  ): Promise<void> {
    const event = new OrderEvent(
      order.id,
      type,
      payload,
      new Date().toISOString()
    );

    try {
      await this.orderPublisher.publish(event);
      this.logger.debug(`Event published for order ${order.id}: ${type}`);
    } catch (error) {
      this.logger.error(
        `Failed to publish event for order ${order.id}: ${error}`,
        error instanceof Error ? error.stack : undefined
      );
      throw error;
    }
  }

  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private validateItems(items: unknown[]): items is OrderItem[] {
    return Array.isArray(items) && items.every(
      item =>
        typeof item === 'object' &&
        item !== null &&
        'productId' in item &&
        'name' in item &&
        'quantity' in item &&
        'price' in item
    );
  }
}

// === ARCHIVO: api/src/infrastructure/kafka/kafka.module.ts ===
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

// === ARCHIVO: api/src/infrastructure/kafka/order-kafka.publisher.ts ===
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

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Logger,
  Sse,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, interval, map, Subject, Subscription } from 'rxjs';
import { OrderEventDto } from '../../common/dto/order-event.dto';
import { OrderEventType } from '../../domain/ports/order-publisher.port';
import { OrderKafkaPublisher } from '../kafka/order-kafka.publisher';

interface ServerSentEvent {
  event: string;
  data: string;
}

@Controller('api/orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  private eventSubscription: Subscription | null = null;
  private readonly eventSubject = new Subject<ServerSentEvent>();

  constructor(private readonly kafkaPublisher: OrderKafkaPublisher) {}

  @Post('events')
  @HttpCode(HttpStatus.CREATED)
  async publishOrderEvent(
    @Body() orderEventDto: OrderEventDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const { orderId, type, payload } = orderEventDto;
      
      if (!orderId || !type) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'orderId and type are required',
        });
      }

      const validTypes = Object.values(OrderEventType);
      if (!validTypes.includes(type)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `Invalid event type. Must be one of: ${validTypes.join(', ')}`,
        });
      }

      await this.kafkaPublisher.publish({
        orderId,
        type,
        payload,
        timestamp: new Date().toISOString(),
        correlationId: this.generateCorrelationId(),
      });

      this.eventSubject.next({
        event: type,
        data: JSON.stringify({ orderId, type, payload, timestamp: new Date().toISOString() }),
      });

      return res.status(HttpStatus.CREATED).json({
        message: 'Event published successfully',
        orderId,
        type,
      });
    } catch (error) {
      this.logger.error(
        `Failed to publish event: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to publish event',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @Get('events')
  @Sse('events-stream')
  getOrderEvents(): Observable<ServerSentEvent> {
    this.logger.log('SSE connection established for order events');
    
    return interval(5000).pipe(
      map(() => ({
        event: 'heartbeat',
        data: JSON.stringify({ timestamp: new Date().toISOString() }),
      })),
    );
  }

  @Get('events/stream')
  async streamEvents(@Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const sendEvent = (event: string, data: unknown): void => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const subscription = this.eventSubject.subscribe({
      next: (event) => sendEvent(event.event, event.data),
      error: (err) => {
        this.logger.error('Event stream error:', err);
        res.end();
      },
    });

    res.on('close', () => {
      subscription.unsubscribe();
      this.logger.log('SSE connection closed');
    });

    sendEvent('connected', { message: 'Connected to order events stream' });
  }

  private generateCorrelationId(): string {
    return `corr-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}

// === ARCHIVO: api/src/infrastructure/kafka/order-kafka.consumer.ts ===
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

// === ARCHIVO: api/src/config/kafka.config.ts ===
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

// === ARCHIVO: api/src/common/exceptions/global-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ExceptionResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || message;
        error = (responseObj.error as string) || undefined;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Excepción no manejada: ${exception.message}`,
        exception.stack
      );
    }

    const exceptionResponse: ExceptionResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    response.status(status).json(exceptionResponse);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let error: string | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resp = exceptionResponse as Record<string, unknown>;
      message = Array.isArray(resp.message) 
        ? (resp.message as string[]).join(', ') 
        : (resp.message as string) || 'Error HTTP';
      error = resp.error as string | undefined;
    } else {
      message = 'Error HTTP';
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    this.logger.warn(
      `HTTP Exception ${status} en ${request.method} ${request.url}: ${message}`
    );

    response.status(status).json(responseBody);
  }
}

@Catch(Error)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(
      `Error de validación: ${exception.message}`,
      exception.stack
    );

    const responseBody = {
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 'Error de validación de datos',
      error: exception.message,
    };

    response.status(HttpStatus.BAD_REQUEST).json(responseBody);
  }
}

// === ARCHIVO: api/test/order.service.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../src/application/order.service';
import { OrderPublisherPort } from '../src/domain/ports/order-publisher.port';
import { OrderEventType } from '../src/domain/ports/order-publisher.port';
import { Order } from '../src/domain/order.model';
import { OrderItem } from '../src/domain/order.model';
import { OrderStatus } from '../src/domain/order-status.enum';

describe('OrderService', () => {
  let service: OrderService;
  let orderPublisher: jest.Mocked<OrderPublisherPort>;

  const mockOrderPublisher = {
    publish: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderPublisherPort,
          useValue: mockOrderPublisher,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderPublisher = module.get(OrderPublisherPort);

    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('debería crear una orden exitosamente', async () => {
      const customerId = 'customer-123';
      const items = [
        new OrderItem('product-1', 'Producto 1', 2, 50),
        new OrderItem('product-2', 'Producto 2', 1, 100),
      ];

      const order = await service.createOrder(customerId, items);

      expect(order).toBeDefined();
      expect(order.customerId).toBe(customerId);
      expect(order.items).toHaveLength(2);
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.getTotalAmount()).toBe(200);
    });

    it('debería publicar evento de orden creada', async () => {
      const customerId = 'customer-456';
      const items = [
        new OrderItem('product-3', 'Producto 3', 1, 75),
      ];

      await service.createOrder(customerId, items);

      expect(orderPublisher.publish).toHaveBeenCalledTimes(1);
      const publishedEvent = orderPublisher.publish.mock.calls[0][0];
      expect(publishedEvent.type).toBe(OrderEventType.ORDER_CREATED);
    });

    it('debería lanzar error si no hay items', async () => {
      const customerId = 'customer-789';
      const items: OrderItem[] = [];

      await expect(service.createOrder(customerId, items)).rejects.toThrow(
        'La orden debe contener al menos un item',
      );
    });
  });

  describe('updateOrderStatus', () => {
    it('debería actualizar el estado de una orden', async () => {
      const customerId = 'customer-111';
      const items = [new OrderItem('product-1', 'Producto 1', 1, 50)];
      const order = await service.createOrder(customerId, items);

      const updatedOrder = await service.updateOrderStatus(
        order.id,
        OrderStatus.PROCESSING,
      );

      expect(updatedOrder.status).toBe(OrderStatus.PROCESSING);
    });

    it('debería publicar evento de orden actualizada', async () => {
      const customerId = 'customer-222';
      const items = [new OrderItem('product-2', 'Producto 2', 1, 75)];
      const order = await service.createOrder(customerId, items);

      await service.updateOrderStatus(order.id, OrderStatus.SHIPPED);

      expect(orderPublisher.publish).toHaveBeenCalledTimes(2);
      const publishedEvent = orderPublisher.publish.mock.calls[1][0];
      expect(publishedEvent.type).toBe(OrderEventType.ORDER_UPDATED);
    });

    it('debería lanzar error si la orden no existe', async () => {
      await expect(
        service.updateOrderStatus('non-existent-id', OrderStatus.CANCELLED),
      ).rejects.toThrow('Orden no encontrada');
    });

    it('debería lanzar error para transición inválida', async () => {
      const customerId = 'customer-333';
      const items = [new OrderItem('product-3', 'Producto 3', 1, 100)];
      const order = await service.createOrder(customerId, items);

      await service.updateOrderStatus(order.id, OrderStatus.PROCESSING);
      await service.updateOrderStatus(order.id, OrderStatus.COMPLETED);

      await expect(
        service.updateOrderStatus(order.id, OrderStatus.PENDING),
      ).rejects.toThrow('Transición de estado inválida');
    });
  });

  describe('getOrder', () => {
    it('debería obtener una orden por su ID', async () => {
      const customerId = 'customer-444';
      const items = [new OrderItem('product-1', 'Producto 1', 1, 60)];
      const createdOrder = await service.createOrder(customerId, items);

      const foundOrder = await service.getOrder(createdOrder.id);

      expect(foundOrder).toBeDefined();
      expect(foundOrder?.id).toBe(createdOrder.id);
    });

    it('debería retornar null si la orden no existe', async () => {
      const foundOrder = await service.getOrder('non-existent-id');

      expect(foundOrder).toBeNull();
    });
  });

  describe('getAllOrders', () => {
    it('debería retornar todas las órdenes', async () => {
      await service.createOrder('customer-1', [
        new OrderItem('product-1', 'Producto 1', 1, 50),
      ]);
      await service.createOrder('customer-2', [
        new OrderItem('product-2', 'Producto 2', 2, 25),
      ]);

      const orders = await service.getAllOrders();

      expect(orders).toHaveLength(2);
    });

    it('debería retornar array vacío si no hay órdenes', async () => {
      const orders = await service.getAllOrders();

      expect(orders).toEqual([]);
    });
  });

  describe('publishEvent', () => {
    it('debería publicar un evento personalizado', async () => {
      const customerId = 'customer-555';
      const items = [new OrderItem('product-1', 'Producto 1', 1, 80)];
      const order = await service.createOrder(customerId, items);

      await service.publishEvent(order, OrderEventType.ORDER_COMPLETED);

      expect(orderPublisher.publish).toHaveBeenCalledTimes(2);
    });
  });

  describe('transiciones de estado válidas', () => {
    it('debería permitir transición de PENDING a PROCESSING', async () => {
      const order = new Order(
        'order-1',
        'customer-1',
        [new OrderItem('p1', 'P1', 1, 10)],
        OrderStatus.PENDING,
        new Date(),
        new Date(),
      );

      expect(order.canTransitionTo(OrderStatus.PROCESSING)).toBe(true);
    });

    it('debería permitir transición de PROCESSING a SHIPPED', async () => {
      const order = new Order(
        'order-2',
        'customer-2',
        [new OrderItem('p2', 'P2', 1, 20)],
        OrderStatus.PROCESSING,
        new Date(),
        new Date(),
      );

      expect(order.canTransitionTo(OrderStatus.SHIPPED)).toBe(true);
    });

    it('debería permitir transición de cualquier estado a CANCELLED', async () => {
      const order = new Order(
        'order-3',
        'customer-3',
        [new OrderItem('p3', 'P3', 1, 30)],
        OrderStatus.SHIPPED,
        new Date(),
        new Date(),
      );

      expect(order.canTransitionTo(OrderStatus.CANCELLED)).toBe(true);
    });

    it('no debería permitir transición de COMPLETED a PENDING', async () => {
      const order = new Order(
        'order-4',
        'customer-4',
        [new OrderItem('p4', 'P4', 1, 40)],
        OrderStatus.COMPLETED,
        new Date(),
        new Date(),
      );

      expect(order.canTransitionTo(OrderStatus.PENDING)).toBe(false);
    });
  });

  describe('OrderItem', () => {
    it('debería calcular el precio total correctamente', () => {
      const item = new OrderItem('product-1', 'Producto 1', 3, 25);

      expect(item.getTotalPrice()).toBe(75);
    });

    it('debería comparar items iguales', () => {
      const item1 = new OrderItem('product-1', 'Producto 1', 2, 50);
      const item2 = new OrderItem('product-1', 'Producto 1', 2, 50);

      expect(item1.equals(item2)).toBe(true);
    });

    it('debería comparar items diferentes como no iguales', () => {
      const item1 = new OrderItem('product-1', 'Producto 1', 2, 50);
      const item2 = new OrderItem('product-2', 'Producto 2', 2, 50);

      expect(item1.equals(item2)).toBe(false);
    });
  });

// === ARCHIVO: api/src/domain/order-status.enum.ts ===
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// === ARCHIVO: client/package.json ===
{
  "name": "client",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~20.0.0",
    "@angular/cdk": "~18.0.0",
    "@angular/common": "~20.0.0",
    "@angular/compiler": "~20.0.0",
    "@angular/core": "~20.0.0",
    "@angular/forms": "~20.0.0",
    "@angular/material": "~18.0.0",
    "@angular/platform-browser": "~20.0.0",
    "@angular/platform-browser-dynamic": "~20.0.0",
    "@angular/router": "~20.0.0",
    "rxjs": "~7.8.1",
    "tslib": "^2.6.2",
    "zone.js": "~0.14.0",
    "@ngrx/effects": "^18.0.0",
    "@ngrx/store": "^18.0.0",
    "@ngrx/store-devtools": "^18.0.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~20.0.0",
    "@angular/cli": "~20.0.0",
    "@angular/compiler-cli": "~20.0.0",
    "@types/node": "^20.11.19",
    "typescript": "~5.8.0-dev.20240322"
  }
}


// === ARCHIVO: client/angular.json ===
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:application": {
          "standalone": true,
          "strict": true,
          "style": "scss"
        },
        "@schematics/angular:component": {
          "standalone": true,
          "style": "scss"
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/client",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [],
            "scripts": []
          },
          "configurations": {
            "development": {
              "optimization": false,
              "outputHashing": "all",
              "sourceMap": true,
              "namedChunks": true,
              "extractLicenses": false,
              "vendorChunk": true,
              "buildOptimizer": false
            },
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "browserTarget": "client:build"
          },
          "configurations": {
            "development": {
              "browserTarget": "client:build:development"
            },
            "production": {
              "browserTarget": "client:build:production"
            }
          }
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "client:build"
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": [
              "tsconfig.json"
            ],
            "exclude": []
          }
        }
      }
    }
  },
  "defaultProject": "client",
  "cli": {
    "analytics": false
  }
}

// === ARCHIVO: client/tsconfig.json ===
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": [
      "ES2022",
      "dom",
      "dom.iterable",
      "scanner"
    ],
    "useDefineForClassFields": false
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}

// === ARCHIVO: client/src/app/shared/models/order-event.model.ts ===
/**
 * Modelo de datos para eventos de órdenes.
 * Representa los cambios de estado en una orden que deben ser reflejados en tiempo real.
 */
export interface OrderEvent {
  /**
   * Identificador único de la orden.
   */
  orderId: string;

  /**
   * Nuevo estado de la orden.
   * Puede ser: 'CREATED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'.
   */
  status: 'CREATED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

  /**
   * Timestamp del evento en formato ISO 8601.
   */
  timestamp: string;

  /**
   * Detalles adicionales del evento, opcional.
   * Ejemplo: motivo de cancelación, ubicación de envío.
   */
  details?: string;
}

/**
 * DTO para publicar un evento de orden en el backend.
 * Se envía como JSON en el cuerpo de la petición POST.
 */
export interface OrderEventDto {
  /**
   * Identificador de la orden.
   */
  orderId: string;

  /**
   * Estado de la orden a publicar.
   */
  status: 'CREATED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

  /**
   * Detalles adicionales, opcional.
   */
  details?: string;
}

// === ARCHIVO: client/src/app/core/services/order-event.service.ts ===
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderEvent, OrderEventDto } from '../../shared/models/order-event.model';
import { environment } from '../../../environments/environment';

/**
 * Servicio para manejar eventos de órdenes en tiempo real.
 * Proporciona métodos para consumir eventos vía SSE y publicar nuevos eventos.
 */
@Injectable({
  providedIn: 'root'
})
export class OrderEventService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Consume eventos de órdenes en tiempo real usando Server-Sent Events.
   * @returns Observable que emite eventos de órdenes según llegan del servidor.
   */
  getOrderEvents(): Observable<OrderEvent> {
    return new Observable<OrderEvent>((subscriber) => {
      const eventSource = new EventSource(`${this.apiUrl}/api/orders/events`);

      eventSource.onmessage = (event) => {
        try {
          const orderEvent: OrderEvent = JSON.parse(event.data);
          subscriber.next(orderEvent);
        } catch (error) {
          subscriber.error(new Error('Error parsing order event'));
        }
      };

      eventSource.onerror = (error) => {
        subscriber.error(new Error('EventSource failed'));
      };

      return () => {
        eventSource.close();
      };
    });
  }

  /**
   * Publica un nuevo evento de orden en el backend.
   * @param eventDto DTO con los datos del evento a publicar.
   * @returns Observable con la respuesta del servidor.
   */
  publishOrderEvent(eventDto: OrderEventDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/orders/events`, eventDto, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// === ARCHIVO: client/src/main.ts ===
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// === ARCHIVO: client/src/index.html ===
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Sistema de Seguimiento de Órdenes en Tiempo Real</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Interfaz de visualización de órdenes en tiempo real con Kafka">
  <meta name="theme-color" content="#1976d2">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
  <noscript>
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1>JavaScript requerido</h1>
      <p>Por favor, habilite JavaScript en su navegador para utilizar esta aplicación.</p>
    </div>
  </noscript>
</body>
</html>

// === ARCHIVO: client/src/app/app.config.ts ===
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimationsAsync()
  ]
};

// === ARCHIVO: client/src/app/app.component.ts ===
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  requiresAuth: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly isAuthenticated = signal<boolean>(false);
  readonly currentUser = signal<string | null>(null);
  readonly isSidenavOpen = signal<boolean>(true);
  readonly unreadNotifications = signal<number>(0);
  readonly pageTitle = signal<string>('Sistema de Gestión de Órdenes');
  
  readonly navItems: NavItem[] = [
    { label: 'Órdenes', route: '/orders', icon: 'list_alt', requiresAuth: true },
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', requiresAuth: true },
    { label: 'Reportes', route: '/reports', icon: 'assessment', requiresAuth: true },
    { label: 'Configuración', route: '/settings', icon: 'settings', requiresAuth: false }
  ];
  
  readonly visibleNavItems = computed(() => {
    return this.navItems.filter(item => 
      !item.requiresAuth || this.isAuthenticated()
    );
  });

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initializeAuthState();
    this.setupNotificationSubscription();
    this.checkUserSession();
  }

  private initializeAuthState(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
      this.isAuthenticated.set(!!user);
      
      if (user) {
        this.notificationService.showSuccess(`Bienvenido, ${user}`);
      }
    });
  }

  private setupNotificationSubscription(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      const unread = notifications.filter(n => !n.read).length;
      this.unreadNotifications.set(unread);
    });
  }

  private checkUserSession(): void {
    if (this.authService.isLoggedIn()) {
      const savedUser = this.authService.getSavedUser();
      if (savedUser) {
        this.currentUser.set(savedUser);
        this.isAuthenticated.set(true);
      }
    }
  }

  toggleSidenav(): void {
    this.isSidenavOpen.update(v => !v);
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onLogout(): void {
    this.authService.logout();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.notificationService.showInfo('Sesión cerrada correctamente');
    this.router.navigate(['/login']);
  }

  onProfile(): void {
    this.router.navigate(['/profile']);
  }

  onViewNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  onNavigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }
}

// === ARCHIVO: client/src/app/features/orders/orders.component.ts ===
import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { OrderEventService } from '../../core/services/order-event.service';
import { OrderEvent } from '../../shared/models/order-event.model';
import { OrderStatusComponent } from '../../shared/components/order-status/order-status.component';
import { CreateOrderDialogComponent } from './components/create-order-dialog.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    OrderStatusComponent
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy {
  private readonly orderEventService = inject(OrderEventService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroy$ = new Subject<void>();

  readonly orders = signal<OrderEvent[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly connectionStatus = signal<'connected' | 'disconnected' | 'connecting'>('disconnected');
  readonly errorMessage = signal<string | null>(null);

  readonly displayedColumns = ['eventType', 'orderId', 'customerId', 'status', 'timestamp', 'actions'];
  readonly orderCount = computed(() => this.orders().length);

  ngOnInit(): void {
    this.connectToEventStream();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private connectToEventStream(): void {
    this.connectionStatus.set('connecting');
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.orderEventService.getOrderEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event) => {
          this.connectionStatus.set('connected');
          this.isLoading.set(false);
          this.handleNewEvent(event);
        },
        error: (err) => {
          console.error('Error en el stream de eventos:', err);
          this.connectionStatus.set('disconnected');
          this.isLoading.set(false);
          this.errorMessage.set('Conexión perdida. Reintentando...');
          this.showNotification('Error de conexión con el servidor', 'error');
        }
      });
  }

  private handleNewEvent(event: OrderEvent): void {
    this.orders.update(currentOrders => {
      const existingIndex = currentOrders.findIndex(o => o.orderId === event.orderId);
      if (existingIndex >= 0) {
        const updated = [...currentOrders];
        updated[existingIndex] = event;
        return updated;
      }
      return [event, ...currentOrders];
    });
  }

  openCreateOrderDialog(): void {
    const dialogRef = this.dialog.open(CreateOrderDialogComponent, {
      width: '500px',
      disableClose: false,
      panelClass: 'order-dialog-panel'
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.createOrder(result);
        }
      });
  }

  private createOrder(orderData: { customerId: string; productId: string; quantity: number }): void {
    this.isLoading.set(true);

    const eventDto = {
      eventType: 'ORDER_CREATED',
      orderId: this.generateOrderId(),
      customerId: orderData.customerId,
      productId: orderData.productId,
      quantity: orderData.quantity,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    };

    this.orderEventService.publishOrderEvent(eventDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.showNotification('Orden creada exitosamente', 'success');
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Error al crear orden:', err);
          this.showNotification('Error al crear la orden', 'error');
        }
      });
  }

  private generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  refreshOrders(): void {
    this.connectToEventStream();
  }

  clearOrders(): void {
    this.orders.set([]);
    this.showNotification('Órdenes limpiadas', 'info');
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}

// === ARCHIVO: client/src/app/features/orders/orders.component.html ===
<div class="orders-container">
  <header class="orders-header">
    <h1>Seguimiento de Órdenes</h1>
    <p class="subtitle">Visualización en tiempo real del estado de tus órdenes</p>
  </header>

  <section class="orders-actions">
    <button 
      mat-raised-button 
      color="primary"
      (click)="publishTestEvent()"
      [disabled]="isPublishing$ | async"
      class="publish-btn">
      <mat-icon>add</mat-icon>
      Publicar Evento de Prueba
    </button>
    <span class="connection-status" [class.connected]="isConnected$ | async">
      <mat-icon>{{ (isConnected$ | async) ? 'wifi' : 'wifi_off' }}</mat-icon>
      {{ (isConnected$ | async) ? 'Conectado' : 'Desconectado' }}
    </span>
  </section>

  <section class="events-list-container">
    <div class="events-header">
      <h2>Eventos Recientes</h2>
      <span class="event-count">{{ (events$ | async)?.length || 0 }} eventos</span>
    </div>

    @if ((events$ | async)?.length === 0) {
      <div class="empty-state">
        <mat-icon>inbox</mat-icon>
        <p>No hay eventos aún</p>
        <span>Los eventos de órdenes aparecerán aquí en tiempo real</span>
      </div>
    } @else {
      <div class="events-list">
        @for (event of events$ | async; track event.id) {
          <app-order-status 
            [event]="event"
            class="event-item">
          </app-order-status>
        } @empty {
          <div class="empty-state">
            <mat-icon>inbox</mat-icon>
            <p>No hay eventos</p>
          </div>
        }
      </div>
    }
  </section>

  @if (error$ | async; as error) {
    <div class="error-banner">
      <mat-icon>error</mat-icon>
      <span>{{ error }}</span>
      <button mat-icon-button (click)="dismissError()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  }
</div>

// === ARCHIVO: client/src/app/features/orders/orders.component.scss ===
.orders-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.orders-header {
  text-align: center;
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.5px;
  }

  .subtitle {
    font-size: 1.1rem;
    color: #6b7280;
    margin: 0;
  }
}

.orders-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  mat-icon {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #fee2e2;
  color: #dc2626;
  transition: all 0.3s ease;

  &.connected {
    background: #dcfce7;
    color: #16a34a;
  }

  mat-icon {
    font-size: 18px;
    width: 18px;
    height: 18px;
  }
}

.events-list-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .event-count {
    font-size: 0.875rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
  }
}

.events-list {
  max-height: 600px;
  overflow-y: auto;
  padding: 1rem;
}

.event-item {
  display: block;
  margin-bottom: 1rem;
  animation: slideIn 0.3s ease-out;

  &:last-child {
    margin-bottom: 0;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  mat-icon {
    font-size: 64px;
    width: 64px;
    height: 64px;
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.5rem 0;
  }

  span {
    font-size: 0.875rem;
    color: #9ca3af;
  }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;

  mat-icon {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  span {
    flex: 1;
    font-size: 0.875rem;
  }

  button {
    color: #dc2626;
  }
}

@media (max-width: 768px) {
  .orders-container {
    padding: 1rem;
  }

  .orders-header h1 {
    font-size: 1.75rem;
  }

  .orders-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .publish-btn {
    width: 100%;
    justify-content: center;
  }
}

// === ARCHIVO: client/src/app/shared/components/order-status/order-status.component.ts ===
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { OrderEvent } from '../../models/order-event.model';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="order-status-card" [class]="getStatusClass()">
      <mat-card-header>
        <mat-card-title class="order-id">
          <mat-icon>{{ getStatusIcon() }}</mat-icon>
          Orden #{{ event?.orderId || 'N/A' }}
        </mat-card-title>
        <mat-card-subtitle class="timestamp">
          {{ formatTimestamp(event?.timestamp) }}
        </mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div class="event-details">
          <div class="detail-row">
            <span class="label">Tipo de Evento:</span>
            <mat-chip-set>
              <mat-chip [class]="getEventTypeClass()">
                {{ event?.eventType || 'UNKNOWN' }}
              </mat-chip>
            </mat-chip-set>
          </div>
          
          <div class="detail-row">
            <span class="label">Estado:</span>
            <span class="status-value" [class]="getStatusTextClass()">
              {{ formatStatus(event?.status) }}
            </span>
          </div>
          
          @if (event?.customerName) {
            <div class="detail-row">
              <span class="label">Cliente:</span>
              <span class="customer-name">{{ event.customerName }}</span>
            </div>
          }
          
          @if (event?.amount) {
            <div class="detail-row">
              <span class="label">Monto:</span>
              <span class="amount">{{ event.amount | currency:'USD':'symbol':'1.2-2' }}</span>
            </div>
          }
          
          @if (event?.message) {
            <div class="message-box">
              <mat-icon>info</mat-icon>
              <span>{{ event.message }}</span>
            </div>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .order-status-card {
      border-left: 4px solid #6b7280;
      transition: all 0.2s ease;
      
      &:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      &.status-created {
        border-left-color: #3b82f6;
      }
      
      &.status-processing {
        border-left-color: #f59e0b;
      }
      
      &.status-completed {
        border-left-color: #10b981;
      }
      
      &.status-cancelled {
        border-left-color: #ef4444;
      }
    }
    
    mat-card-header {
      padding-bottom: 0.5rem;
    }
    
    .order-id {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      
      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }
    
    .timestamp {
      font-size: 0.8rem;
      color: #9ca3af;
    }
    
    .event-details {
      padding-top: 0.5rem;
    }
    
    .detail-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    .label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      min-width: 120px;
    }
    
    .status-value {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
      
      &.status-pending { color: #f59e0b; }
      &.status-processing { color: #3b82f6; }
      &.status-completed { color: #10b981; }
      &.status-cancelled { color: #ef4444; }
    }
    
    .customer-name {
      font-weight: 500;
      color: #374151;
    }
    
    .amount {
      font-weight: 700;
      color: #1f2937;
      font-size: 1rem;
    }
    
    .message-box {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-top: 1rem;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      
      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: #6b7280;
        flex-shrink: 0;
        margin-top: 2px;
      }
      
      span {
        font-size: 0.875rem;
        color: #4b5563;
        line-height: 1.4;
      }
    }
    
    mat-chip {
      font-size: 0.75rem;
      min-height: 24px;
      
      &.chip-created { background: #dbeafe; color: #1d4ed8; }
      &.chip-updated { background: #fef3c7; color: #b45309; }
      &.chip-deleted { background: #fee2e2; color: #dc2626; }
    }
  `]
})
export class OrderStatusComponent {
  @Input({ required: true }) event!: OrderEvent;

  getStatusClass(): string {
    if (!this.event?.status) return '';
    return `status-${this.event.status.toLowerCase()}`;
  }

  getStatusIcon(): string {
    if (!this.event?.status) return 'receipt';
    
    const statusIcons: Record<string, string> = {
      'PENDING': 'hourglass_empty',
      'PROCESSING': 'sync',
      'COMPLETED': 'check_circle',
      'CANCELLED': 'cancel',
      'CREATED': 'add_circle',
      'UPDATED': 'edit',
      'DELETED': 'delete'
    };
    
    return statusIcons[this.event.status.toUpperCase()] || 'receipt';
  }

  getEventTypeClass(): string {
    if (!this.event?.eventType) return '';
    
    const eventTypeClasses: Record<string, string> = {
      'ORDER_CREATED': 'chip-created',
      'ORDER_UPDATED': 'chip-updated',
      'ORDER_DELETED': 'chip-deleted'
    };
    
    return eventTypeClasses[this.event.eventType.toUpperCase()] || '';
  }

  formatStatus(status?: string): string {
    if (!status) return 'SIN ESTADO';
    return status.toUpperCase().replace('_', ' ');
  }

  formatTimestamp(timestamp?: string): string {
    if (!timestamp) return 'Sin fecha';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Hace un momento';
      if (diffMins < 60) return `Hace ${diffMins} minutos`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Hace ${diffHours} horas`;
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  }
}

// === ARCHIVO: client/src/environments/environment.ts ===
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

// === ARCHIVO: client/src/app/app.routes.ts ===
import { Routes } from '@angular/router';
import { OrdersComponent } from './features/orders/orders.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrdersComponent,
    title: 'Gestión de Órdenes'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];

// === ARCHIVO: client/src/app/core/services/auth.service.ts ===
import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  token?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<string | null>(null);
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';
  private readonly sessionTimeout = 30 * 60 * 1000;
  private sessionTimer: ReturnType<typeof setTimeout> | null = null;
  
  readonly currentUser$: Observable<string | null> = this.currentUserSubject.asObservable();
  readonly isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeFromStorage();
    }
  }

  private initializeFromStorage(): void {
    try {
      const token = localStorage.getItem(this.tokenKey);
      const userJson = localStorage.getItem(this.userKey);
      
      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        this._currentUser.set(user);
        this.currentUserSubject.next(user.username);
        this.isAuthenticatedSubject.next(true);
        this.startSessionTimer();
      }
    } catch (error) {
      this.clearStorage();
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this._isLoading.set(true);
    this._error.set(null);
    
    return of(this.simulateLogin(credentials)).pipe(
      delay(800),
      tap(response => {
        this._isLoading.set(false);
        
        if (response.success && response.user && response.token) {
          this.handleSuccessfulLogin(response.user, response.token, credentials.rememberMe ?? false);
        } else {
          this._error.set(response.message ?? 'Error de autenticación');
        }
      })
    );
  }

  private simulateLogin(credentials: LoginCredentials): AuthResponse {
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      return {
        success: true,
        user: {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          token: 'mock-jwt-token-admin'
        },
        token: 'mock-jwt-token-admin',
        message: 'Login exitoso'
      };
    }
    
    if (credentials.username === 'user' && credentials.password === 'user123') {
      return {
        success: true,
        user: {
          id: '2',
          username: 'user',
          email: 'user@example.com',
          role: 'user',
          token: 'mock-jwt-token-user'
        },
        token: 'mock-jwt-token-user',
        message: 'Login exitoso'
      };
    }
    
    return {
      success: false,
      message: 'Credenciales inválidas'
    };
  }

  private handleSuccessfulLogin(user: User, token: string, rememberMe: boolean): void {
    this._currentUser.set(user);
    this.currentUserSubject.next(user.username);
    this.isAuthenticatedSubject.next(true);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      
      if (rememberMe) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
      } else {
        sessionStorage.setItem(this.userKey, JSON.stringify(user));
      }
    }
    
    this.startSessionTimer();
  }

  logout(): void {
    this._currentUser.set(null);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.clearSessionTimer();
    
    if (isPlatformBrowser(this.platformId)) {
      this.clearStorage();
    }
  }

  private clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      sessionStorage.removeItem(this.userKey);
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.tokenKey) || !!sessionStorage.getItem(this.userKey);
    }
    return this.isAuthenticatedSubject.value;
  }

  getSavedUser(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
      if (userJson) {
        try {
          const user = JSON.parse(userJson) as User;
          return user.username;
        } catch {
          return null;
        }
      }
    }
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  hasRole(requiredRole: 'admin' | 'user' | 'guest'): boolean {
    const user = this._currentUser();
    if (!user) return false;
    
    const roleHierarchy = { admin: 3, user: 2, guest: 1 };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  refreshToken(): Observable<AuthResponse> {
    const currentUser = this._currentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('No hay sesión activa'));
    }
    
    return of({
      success: true,
      user: currentUser,
      token: 'refreshed-jwt-token-' + Date.now(),
      message: 'Token refrescado'
    }).pipe(
      delay(300),
      tap(response => {
        if (response.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  private startSessionTimer(): void {
    this.clearSessionTimer();
    
    if (isPlatformBrowser(this.platformId)) {
      this.sessionTimer = setTimeout(() => {
        this.logout();
      }, this.sessionTimeout);
    }
  }

  private clearSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  resetSessionTimer(): void {
    if (this.isAuthenticatedSubject.value) {
      this.startSessionTimer();
    }
  }
}

// === ARCHIVO: client/src/app/core/services/notification.service.ts ===
import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  autoDismiss?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private readonly toastsSubject = new BehaviorSubject<Notification[]>([]);
  
  readonly notifications$ = this.notificationsSubject.asObservable();
  readonly toasts$ = this.toastsSubject.asObservable();
  
  private readonly _notifications = signal<Notification[]>([]);
  private readonly _toasts = signal<Notification[]>([]);
  private readonly _unreadCount = computed(() => 
    this._notifications().filter(n => !n.read).length
  );
  
  readonly notifications = computed(() => this._notifications());
  readonly toasts = computed(() => this._toasts());
  readonly unreadCount = computed(() => this._unreadCount());
  
  private readonly defaultDuration = 5000;
  private toastTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem('app_notifications');
        if (stored) {
          const parsed = JSON.parse(stored) as Notification[];
          const withDates = parsed.map(n => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }));
          this._notifications.set(withDates);
          this.notificationsSubject.next(withDates);
        }
      } catch (error) {
        console.error('Error loading notifications from storage:', error);
      }
    }
  }

  private saveToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('app_notifications', JSON.stringify(this._notifications()));
      } catch (error) {
        console.error('Error saving notifications to storage:', error);
      }
    }
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  showSuccess(message: string, title: string = 'Éxito'): void {
    this.showNotification('success', title, message);
  }

  showError(message: string, title: string = 'Error'): void {
    this.showNotification('error', title, message, false);
  }

  showWarning(message: string, title: string = 'Advertencia'): void {
    this.showNotification('warning', title, message);
  }

  showInfo(message: string, title: string = 'Información'): void {
    this.showNotification('info', title, message);
  }

  private showNotification(
    type: Notification['type'],
    title: string,
    message: string,
    autoDismiss: boolean = true,
    duration?: number
  ): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      autoDismiss,
      duration: duration ?? this.defaultDuration
    };

    this.addNotification(notification);
    
    if (autoDismiss) {
      this.scheduleAutoDismiss(notification.id, notification.duration!);
    }
  }

  private addNotification(notification: Notification): void {
    const current = this._notifications();
    const updated = [notification, ...current].slice(0, 100);
    this._notifications.set(updated);
    this.notificationsSubject.next(updated);
    this.saveToStorage();
  }

  private scheduleAutoDismiss(id: string, duration: number): void {
    const timer = setTimeout(() => {
      this.dismissToast(id);
    }, duration);
    this.toastTimers.set(id, timer);
  }

  dismissToast(id: string): void {
    const timer = this.toastTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.toastTimers.delete(id);
    }
    
    const currentToasts = this._toasts();
    const updatedToasts = currentToasts.filter(t => t.id !== id);
    this._toasts.set(updatedToasts);
    this.toastsSubject.next(updatedToasts);
  }

  showToast(type: Notification['type'], title: string, message: string, duration?: number): void {
    const toast: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: true,
      autoDismiss: true,
      duration: duration ?? this.defaultDuration
    };
    
    const currentToasts = this._toasts();
    const updatedToasts = [...currentToasts, toast].slice(-5);
    this._toasts.set(updatedToasts);
    this.toastsSubject.next(updatedToasts);
    
    this.scheduleAutoDismiss(toast.id, toast.duration!);
  }

  markAsRead(id: string): void {
    const current = this._notifications();
    const updated = current.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this._notifications.set(updated);
    this.notificationsSubject.next(updated);
    this.saveToStorage();
  }

  markAllAsRead(): void {
    const current = this._notifications();
    const updated = current.map(n => ({ ...n, read: true }));
    this._notifications.set(updated);
    this.notificationsSubject.next(updated);
    this.saveToStorage();
  }

  deleteNotification(id: string): void {
    const current = this._notifications();
    const updated = current.filter(n => n.id !== id);
    this._notifications.set(updated);
    this.notificationsSubject.next(updated);
    this.saveToStorage();
  }

  clearAll(): void {
    this._notifications.set([]);
    this.notificationsSubject.next([]);
    this.saveToStorage();
  }

  getNotificationsByType(type: Notification['type']): Notification[] {
    return this._notifications().filter(n => n.type === type);
  }

  getUnreadNotifications(): Notification[] {
    return this._notifications().filter(n => !n.read);
  }

  getNotificationCount(): number {
    return this._notifications().length;
  }

  getUnreadCount(): number {
    return this._unreadCount();
  }
}

// === ARCHIVO: client/src/app/features/orders/components/create-order-dialog.component.ts ===
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>add_shopping_cart</mat-icon>
      Crear Nueva Orden
    </h2>
    <mat-dialog-content>
      <form [formGroup]="orderForm" class="order-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ID de Cliente</mat-label>
          <input matInput formControlName="customerId" placeholder="Ingrese el ID del cliente">
          <mat-icon matSuffix>person</mat-icon>
          <mat-error *ngIf="orderForm.get('customerId')?.hasError('required')">
            El ID de cliente es obligatorio
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Producto</mat-label>
          <mat-select formControlName="productId">
            <mat-option *ngFor="let product of products" [value]="product.id">
              {{ product.name }} - \${{ product.price }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="orderForm.get('productId')?.hasError('required')">
            Seleccione un producto
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cantidad</mat-label>
          <input matInput type="number" formControlName="quantity" min="1" max="100">
          <mat-icon matSuffix>numbers</mat-icon>
          <mat-error *ngIf="orderForm.get('quantity')?.hasError('required')">
            La cantidad es obligatoria
          </mat-error>
          <mat-error *ngIf="orderForm.get('quantity')?.hasError('min')">
            Mínimo 1 unidad
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" class="cancel-button">
        Cancelar
      </button>
      <button mat-raised-button color="primary" 
              (click)="onSubmit()" 
              [disabled]="!orderForm.valid"
              class="submit-button">
        <mat-icon>check</mat-icon>
        Crear Orden
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .order-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 400px;
      padding-top: 8px;
    }
    .full-width {
      width: 100%;
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
    }
    mat-dialog-actions {
      padding: 16px 0;
    }
    .submit-button {
      margin-left: 8px;
    }
  `]
})
export class CreateOrderDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateOrderDialogComponent>);

  readonly orderForm: FormGroup = this.fb.group({
    customerId: ['', [Validators.required, Validators.minLength(3)]],
    productId: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1), Validators.max(100)]]
  });

  readonly products = [
    { id: 'PROD-001', name: 'Laptop Pro 15"', price: 1299.99 },
    { id: 'PROD-002', name: 'Mouse Inalámbrico', price: 49.99 },
    { id: 'PROD-003', name: 'Teclado Mecánico', price: 149.99 },
    { id: 'PROD-004', name: 'Monitor 27" 4K', price: 449.99 },
    { id: 'PROD-005', name: 'Auriculares Bluetooth', price: 199.99 }
  ];

  onSubmit(): void {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      this.dialogRef.close(formValue);
    } else {
      this.orderForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  kafka:
    image: "apache/kafka:3.8.0"
    ports:
      - "127.0.0.1:9092:9092"
    environment:
      KAFKA_NODE_ID: "1"
      KAFKA_PROCESS_ROLES: "broker,controller"
      KAFKA_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://localhost:9092"
      KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
      KAFKA_CONTROLLER_QUORUM_VOTERS: "1@localhost:9093"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0"
    healthcheck:
      test: ["CMD-SHELL","/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092 > /dev/null 2>&1"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 30s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| Apache Kafka (KRaft, un nodo) | `apache/kafka:3.8.0` | 9092 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/kafka/create-topics.sh ===
#!/usr/bin/env bash
# Crea los topics en Kafka local (idempotente). Ejecutar con el compose levantado y healthy.
set -euo pipefail

docker compose exec -T kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic app-events --partitions 1 --replication-factor 1

```
