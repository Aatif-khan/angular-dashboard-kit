import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/auth.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getUsers(): Observable<User[]> {
    return this.api.get<User[]>('users');
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this.api.post<User>('users', user);
  }

  updateUser(user: User): Observable<User> {
    return this.api.put<User>(`users/${user.id}`, user);
  }

  deleteUser(id: string): Observable<string> {
    return this.api.delete<string>(`users/${id}`);
  }

  getProfile(): Observable<User> {
    return this.api.get<User>('users/profile');
  }

  updateProfile(user: Partial<User>): Observable<User> {
    return this.api.put<User>('users/profile', user);
  }

  updatePassword(passwords: any): Observable<any> {
    return this.api.put<any>('users/profile/password', passwords);
  }
}
