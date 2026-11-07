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