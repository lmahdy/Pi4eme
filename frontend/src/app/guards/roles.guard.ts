import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const rolesGuard: (allowedRoles: string[], redirectTo?: string) => CanActivateFn = (allowedRoles, redirectTo = '/admin') => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUserRole$.pipe(
      take(1),
      map(role => {
        if (role && allowedRoles.includes(role)) {
          return true;
        }
        router.navigate([redirectTo]);
        return false;
      })
    );
  };
};
