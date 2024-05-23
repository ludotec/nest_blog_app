import { ApplicationConfig, ErrorHandler, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors  } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { serverErrorInterceptor } from './core/errors/interceptors/server-error.interceptor';
import { GlobalErrorHandler } from './core/errors/interceptors/global-error-handler';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }), provideAnimationsAsync(), provideAnimationsAsync(),
    provideHttpClient(withInterceptors([jwtInterceptor, serverErrorInterceptor])),
    JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    {provide: ErrorHandler, useClass: GlobalErrorHandler}]
};
