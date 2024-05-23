import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Message: ${error.error.message}`;
    }else {
      errorMessage = `Text: ${error.statusText}, Code: ${error.status}, message: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }));
};
