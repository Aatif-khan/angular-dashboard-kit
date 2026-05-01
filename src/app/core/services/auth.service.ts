import { Injectable, inject } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { AuthResponse, LoginCredentials } from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenService = inject(TokenService);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock API
    if (credentials.email === 'admin@dashkit.com') {
      return of({
        token: 'mock-jwt-token-admin-12345',
        user: {
          id: '1',
          email: 'admin@dashkit.com',
          firstName: 'Admin',
          lastName: 'User',
          roles: ['admin']
        }
      }).pipe(delay(800));
    } else if (credentials.email === 'user@dashkit.com') {
      return of({
        token: 'mock-jwt-token-user-67890',
        user: {
          id: '2',
          email: 'user@dashkit.com',
          firstName: 'Standard',
          lastName: 'User',
          roles: ['editor']
        }
      }).pipe(delay(800));
    }
    
    return throwError(() => new Error('Invalid email or password')).pipe(delay(800));
  }

  logout(): void {
    this.tokenService.removeToken();
  }
}
