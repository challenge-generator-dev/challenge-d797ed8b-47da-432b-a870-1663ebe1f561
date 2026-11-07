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