import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Array<string>;
  const user = tokenService.getUser();

  if (!user || !user.roles) {
    return router.createUrlTree(['/forbidden']);
  }

  const hasRole = user.roles.some((role) => expectedRoles.includes(role));

  if (!hasRole) {
    return router.createUrlTree(['/forbidden']);
  }

  return true;
};
