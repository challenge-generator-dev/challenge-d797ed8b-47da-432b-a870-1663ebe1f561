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