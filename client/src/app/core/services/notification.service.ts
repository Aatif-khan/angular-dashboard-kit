import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationActions } from '../../store/notification/notification.actions';
import { NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private store = inject(Store);

  success(message: string, duration = 4000) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000) {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 4000) {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 4000) {
    this.show(message, 'warning', duration);
  }

  private show(message: string, type: NotificationType, duration: number) {
    this.store.dispatch(NotificationActions.addNotification({ 
      notification: { message, type, duration } 
    }));
  }
}
