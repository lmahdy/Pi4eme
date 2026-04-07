import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, combineLatest } from 'rxjs';

export const accountantDemoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([
    authService.currentUserRole$,
    authService.currentUserEmail$
  ]).pipe(
    take(1),
    map(([role, email]) => {
      // Allow only the specific demo accountant account
      // We still check roles to ensure basic role-based security is met
      const isAllowedRole = role === 'Accountant' || role === 'CompanyOwner';
      const isDemoAccount = email === 'accountant@demo.com';

      if (isAllowedRole && isDemoAccount) {
        return true;
      }

      console.warn(`Access denied to ${state.url} for user ${email} with role ${role}`);
      router.navigate(['/sales']);
      return false;
    })
  );
};
