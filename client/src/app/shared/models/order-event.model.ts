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