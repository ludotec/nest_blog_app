import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from 'app/services/auth/authentication.service';

export const userIsUserGuard: CanActivateFn = (route, state) => {
  if (!inject(AuthenticationService).userIsUser(Number(route.paramMap.get('id')))) {
    inject(Router).navigate(['/login']);
    return false;
  }
  return true;
};
