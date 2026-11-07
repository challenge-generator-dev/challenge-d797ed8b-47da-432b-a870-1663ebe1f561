import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  requiresAuth: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly isAuthenticated = signal<boolean>(false);
  readonly currentUser = signal<string | null>(null);
  readonly isSidenavOpen = signal<boolean>(true);
  readonly unreadNotifications = signal<number>(0);
  readonly pageTitle = signal<string>('Sistema de Gestión de Órdenes');
  
  readonly navItems: NavItem[] = [
    { label: 'Órdenes', route: '/orders', icon: 'list_alt', requiresAuth: true },
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', requiresAuth: true },
    { label: 'Reportes', route: '/reports', icon: 'assessment', requiresAuth: true },
    { label: 'Configuración', route: '/settings', icon: 'settings', requiresAuth: false }
  ];
  
  readonly visibleNavItems = computed(() => {
    return this.navItems.filter(item => 
      !item.requiresAuth || this.isAuthenticated()
    );
  });

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initializeAuthState();
    this.setupNotificationSubscription();
    this.checkUserSession();
  }

  private initializeAuthState(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
      this.isAuthenticated.set(!!user);
      
      if (user) {
        this.notificationService.showSuccess(`Bienvenido, ${user}`);
      }
    });
  }

  private setupNotificationSubscription(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      const unread = notifications.filter(n => !n.read).length;
      this.unreadNotifications.set(unread);
    });
  }

  private checkUserSession(): void {
    if (this.authService.isLoggedIn()) {
      const savedUser = this.authService.getSavedUser();
      if (savedUser) {
        this.currentUser.set(savedUser);
        this.isAuthenticated.set(true);
      }
    }
  }

  toggleSidenav(): void {
    this.isSidenavOpen.update(v => !v);
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onLogout(): void {
    this.authService.logout();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.notificationService.showInfo('Sesión cerrada correctamente');
    this.router.navigate(['/login']);
  }

  onProfile(): void {
    this.router.navigate(['/profile']);
  }

  onViewNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  onNavigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }
}