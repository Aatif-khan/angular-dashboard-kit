import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { userReducer } from './store/user/user.reducer';
import { notificationReducer } from './store/notification/notification.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { UserEffects } from './store/user/user.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { cacheInterceptor } from './core/interceptors/cache.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ─── Router ──────────────────────────────────────────────────────────────
    provideRouter(
      routes,
      withComponentInputBinding(),       // bind route params directly to @Input()
      withViewTransitions(),             // smooth view transition animations
    ),

    // ─── HTTP Client ─────────────────────────────────────────────────────────
    provideHttpClient(
      withFetch(),                       // use native fetch instead of XHR
      withInterceptors([
        authInterceptor,                 // attach JWT Bearer token
        errorInterceptor,                // handle 401 / 403 / 500 globally
        cacheInterceptor,                // cache GET responses with TTL
      ]),
    ),

    // ─── Animations ──────────────────────────────────────────────────────────
    provideAnimationsAsync(),

    // ─── NgRx Store ──────────────────────────────────────────────────────────
    provideStore({
      router: routerReducer,
      auth: authReducer,
      users: userReducer,
      notifications: notificationReducer,
    }),

    // ─── NgRx Effects ────────────────────────────────────────────────────────
    provideEffects([
      AuthEffects,
      UserEffects,
    ]),

    // ─── NgRx Router Store ───────────────────────────────────────────────────
    provideRouterStore(),

    // ─── NgRx DevTools (dev only) ────────────────────────────────────────────
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),
  ],
};
