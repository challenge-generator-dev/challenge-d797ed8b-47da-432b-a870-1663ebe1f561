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