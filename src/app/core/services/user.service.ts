import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { User } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  // Mock database
  private users: User[] = [
    { id: '1', email: 'admin@dashkit.com', firstName: 'Admin', lastName: 'User', roles: ['admin'] },
    { id: '2', email: 'user@dashkit.com', firstName: 'Standard', lastName: 'User', roles: ['editor'] },
    { id: '3', email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', roles: ['viewer'] },
    { id: '4', email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith', roles: ['editor'] },
    { id: '5', email: 'michael.b@example.com', firstName: 'Michael', lastName: 'Brown', roles: ['viewer'] },
  ];

  getUsers(): Observable<User[]> {
    return of([...this.users]).pipe(delay(800));
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser: User = { ...user, id: Math.random().toString(36).substring(2, 9) };
    this.users = [...this.users, newUser];
    return of(newUser).pipe(delay(600));
  }

  updateUser(user: User): Observable<User> {
    this.users = this.users.map(u => u.id === user.id ? user : u);
    return of(user).pipe(delay(600));
  }

  deleteUser(id: string): Observable<string> {
    this.users = this.users.filter(u => u.id !== id);
    return of(id).pipe(delay(500));
  }
}
