import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IJwtDecoded, LoginForm, RegisterForm } from '../interfaces/auth';
import { environment } from '../../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';

const BASE_URL = environment.API_URL;
export const JWT_NAME = 'access_token';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient, private jwtHelper: JwtHelperService
  ) { }

  login(loginForm: LoginForm) {
    return this.http.post<any>(`${BASE_URL}/api/users/login`, {email: loginForm.email, password: loginForm.password}).pipe(
      map((token) => {
        localStorage.setItem(JWT_NAME, token.access_token);
        console.log('# AuthenticationService.login: ', token);
        return token;
      })
    );
  }

  register(registerForm: RegisterForm) {
    return this.http.post<any>(`${BASE_URL}/api/users`, registerForm).pipe(
      map(user => user)
    ); 
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_NAME);
    return !this.jwtHelper.isTokenExpired(token);
  }

  getUserId(): Observable<number> {
  return of(localStorage.getItem(JWT_NAME)).pipe(
    switchMap((jwt: any) => of(this.jwtHelper.decodeToken(jwt)).pipe(
      tap((decode: null | IJwtDecoded) => console.log('# AuthenticatedService.getUserId: ', decode)),
      map((decode: null | IJwtDecoded) => {
          return decode ? decode.user.id : 0
        })
      )),
    )    
  }
}
