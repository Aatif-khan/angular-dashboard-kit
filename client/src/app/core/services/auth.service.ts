import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, LoginCredentials } from '../models/auth.model';
import { TokenService } from './token.service';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenService = inject(TokenService);
  private api = inject(ApiService);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', credentials);
  }

  logout(): void {
    this.tokenService.removeToken();
  }
}
