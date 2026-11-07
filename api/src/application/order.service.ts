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