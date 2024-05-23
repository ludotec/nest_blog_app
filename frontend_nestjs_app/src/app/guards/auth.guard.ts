import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from 'app/services/auth/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  if (!inject(AuthenticationService).isAuthenticated()) {
    inject(Router).navigate(['/login']);
    return false
  }else {
    return true;
  }
};
