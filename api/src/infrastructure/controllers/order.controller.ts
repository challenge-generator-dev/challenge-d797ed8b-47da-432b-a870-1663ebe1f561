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