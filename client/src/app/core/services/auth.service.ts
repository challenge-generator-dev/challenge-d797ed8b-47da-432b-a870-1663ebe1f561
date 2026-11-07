import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  token?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<string | null>(null);
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';
  private readonly sessionTimeout = 30 * 60 * 1000;
  private sessionTimer: ReturnType<typeof setTimeout> | null = null;
  
  readonly currentUser$: Observable<string | null> = this.currentUserSubject.asObservable();
  readonly isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeFromStorage();
    }
  }

  private initializeFromStorage(): void {
    try {
      const token = localStorage.getItem(this.tokenKey);
      const userJson = localStorage.getItem(this.userKey);
      
      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        this._currentUser.set(user);
        this.currentUserSubject.next(user.username);
        this.isAuthenticatedSubject.next(true);
        this.startSessionTimer();
      }
    } catch (error) {
      this.clearStorage();
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this._isLoading.set(true);
    this._error.set(null);
    
    return of(this.simulateLogin(credentials)).pipe(
      delay(800),
      tap(response => {
        this._isLoading.set(false);
        
        if (response.success && response.user && response.token) {
          this.handleSuccessfulLogin(response.user, response.token, credentials.rememberMe ?? false);
        } else {
          this._error.set(response.message ?? 'Error de autenticación');
        }
      })
    );
  }

  private simulateLogin(credentials: LoginCredentials): AuthResponse {
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      return {
        success: true,
        user: {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          token: 'mock-jwt-token-admin'
        },
        token: 'mock-jwt-token-admin',
        message: 'Login exitoso'
      };
    }
    
    if (credentials.username === 'user' && credentials.password === 'user123') {
      return {
        success: true,
        user: {
          id: '2',
          username: 'user',
          email: 'user@example.com',
          role: 'user',
          token: 'mock-jwt-token-user'
        },
        token: 'mock-jwt-token-user',
        message: 'Login exitoso'
      };
    }
    
    return {
      success: false,
      message: 'Credenciales inválidas'
    };
  }

  private handleSuccessfulLogin(user: User, token: string, rememberMe: boolean): void {
    this._currentUser.set(user);
    this.currentUserSubject.next(user.username);
    this.isAuthenticatedSubject.next(true);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      
      if (rememberMe) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
      } else {
        sessionStorage.setItem(this.userKey, JSON.stringify(user));
      }
    }
    
    this.startSessionTimer();
  }

  logout(): void {
    this._currentUser.set(null);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.clearSessionTimer();
    
    if (isPlatformBrowser(this.platformId)) {
      this.clearStorage();
    }
  }

  private clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      sessionStorage.removeItem(this.userKey);
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.tokenKey) || !!sessionStorage.getItem(this.userKey);
    }
    return this.isAuthenticatedSubject.value;
  }

  getSavedUser(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
      if (userJson) {
        try {
          const user = JSON.parse(userJson) as User;
          return user.username;
        } catch {
          return null;
        }
      }
    }
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  hasRole(requiredRole: 'admin' | 'user' | 'guest'): boolean {
    const user = this._currentUser();
    if (!user) return false;
    
    const roleHierarchy = { admin: 3, user: 2, guest: 1 };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  refreshToken(): Observable<AuthResponse> {
    const currentUser = this._currentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('No hay sesión activa'));
    }
    
    return of({
      success: true,
      user: currentUser,
      token: 'refreshed-jwt-token-' + Date.now(),
      message: 'Token refrescado'
    }).pipe(
      delay(300),
      tap(response => {
        if (response.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  private startSessionTimer(): void {
    this.clearSessionTimer();
    
    if (isPlatformBrowser(this.platformId)) {
      this.sessionTimer = setTimeout(() => {
        this.logout();
      }, this.sessionTimeout);
    }
  }

  private clearSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  resetSessionTimer(): void {
    if (this.isAuthenticatedSubject.value) {
      this.startSessionTimer();
    }
  }
}