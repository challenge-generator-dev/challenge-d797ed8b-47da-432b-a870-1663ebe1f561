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