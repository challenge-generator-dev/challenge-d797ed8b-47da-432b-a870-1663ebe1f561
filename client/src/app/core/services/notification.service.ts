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