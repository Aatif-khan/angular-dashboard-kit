import { createActionGroup, props } from '@ngrx/store';
import { Notification } from '../../core/models/notification.model';

export const NotificationActions = createActionGroup({
  source: 'Notification',
  events: {
    'Add Notification': props<{ notification: Omit<Notification, 'id'> }>(),
    'Remove Notification': props<{ id: string }>(),
  }
});
