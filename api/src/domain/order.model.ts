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