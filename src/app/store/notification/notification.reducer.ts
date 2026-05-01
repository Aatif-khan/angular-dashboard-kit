import { createReducer, on } from '@ngrx/store';
import { Notification } from '../../core/models/notification.model';
import { NotificationActions } from './notification.actions';

export interface NotificationState {
  notifications: Notification[];
}

export const initialState: NotificationState = {
  notifications: [],
};

export const notificationReducer = createReducer(
  initialState,
  on(NotificationActions.addNotification, (state, { notification }) => ({
    ...state,
    notifications: [
      ...state.notifications,
      { ...notification, id: Math.random().toString(36).substring(2, 9) }
    ],
  })),
  on(NotificationActions.removeNotification, (state, { id }) => ({
    ...state,
    notifications: state.notifications.filter((n) => n.id !== id),
  }))
);
