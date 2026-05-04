import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        // Extract the friendly message we built in our backend error handler
        errorMessage = error.error?.message || error.message || errorMessage;

        // Handle specific status codes
        if (error.status === 401) {
          // If we are NOT on the login page, it means our session actually expired
          if (!req.url.includes('auth/login')) {
            authService.logout();
            router.navigate(['/auth/login']);
            errorMessage = 'Session expired. Please login again.';
          } else {
            // If we ARE on the login page, it's just a wrong password
            errorMessage = error.error?.message || 'Invalid email or password';
          }
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to access this resource.';
        } else if (error.status === 404) {
          // Prioritize the server's custom error message for 404s
          errorMessage = error.error?.message || 'The requested resource was not found.';
        }
      }

      // Show the beautiful toast notification
      notificationService.error(errorMessage);
      
      return throwError(() => new Error(errorMessage));
    })
  );
};
