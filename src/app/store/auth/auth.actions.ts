import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthResponse, LoginCredentials, User } from '../../core/models/auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ credentials: LoginCredentials }>(),
    'Login Success': props<{ response: AuthResponse }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
    'Set User': props<{ user: User | null }>(),
  }
});
