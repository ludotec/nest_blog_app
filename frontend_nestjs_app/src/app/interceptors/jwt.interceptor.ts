import { HttpInterceptorFn } from '@angular/common/http';
import { JWT_NAME } from 'app/services/auth/authentication.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem(JWT_NAME);
  if (authToken) {
    const reqCloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      } 
    });
    return next(reqCloned);
  }else {
    return next(req);
  }
  
};
