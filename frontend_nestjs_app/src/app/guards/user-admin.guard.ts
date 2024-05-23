import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from 'app/services/auth/authentication.service';

export const userAdminGuard: CanActivateFn = (route, state) => {
  if (!inject(AuthenticationService).userIsAdmin()) {
    inject(Router).navigate(['/login']);
    return false;
  }
  return true;
};
