import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IJwtDecoded, LoginForm, RegisterForm } from '../../interfaces/auth';
import { environment } from '../../../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IUser, UserRole } from 'app/interfaces/user';

const BASE_URL = environment.API_URL;
export const JWT_NAME = 'access_token';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // user is logged (authenticated)
  private isLoggedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isLogged$: Observable<boolean> = this.isLoggedSubject.asObservable();

  // id de usuario
  private userIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  userId$: Observable<number | null> = this.userIdSubject.asObservable();

  constructor(
    private http: HttpClient, private jwtHelper: JwtHelperService
  ) { }

  login(loginForm: LoginForm) {
    return this.http.post<any>(`${BASE_URL}/api/users/login`, {email: loginForm.email, password: loginForm.password}).pipe(
      map((token) => {
        localStorage.setItem(JWT_NAME, token.access_token);
        console.log('# AuthenticationService.login: ', token);
        // obtener su id y subscribirse a los posibles cambios
        this.fetchAndSetUserIdFromToken().subscribe();
        // comunicar estado del usuario autenticado
        this.isLoggedSubject.next(true);
        return token;
      })
    );
  }

  /* register(registerForm: RegisterForm) {
    return this.http.post<any>(`${BASE_URL}/api/users`, registerForm).pipe(
      map(user => user)
    ); 
  } */

  registerAndLogin(user: RegisterForm): Observable<{ user: IUser; access_token: string }> {
    return this.http.post<any>(`${BASE_URL}/api/users`, user).pipe(
      tap(({ user, access_token }) => {
        console.log('## user an token: ', user, access_token);
        this.loginAfterRegistration(access_token);
      }),
    );
  }

  private loginAfterRegistration(token: string): void {
    // anotar el token en el localstorage
    localStorage.setItem(JWT_NAME, token);
    // setear el id en el bheavior subject
    this.fetchAndSetUserIdFromToken().subscribe();
    // comunicar el estado del usuario autenticado
    this.isLoggedSubject.next(true);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  userIsAdmin() {
    if (!this.isAuthenticated())  return false;
    const token = this.getToken();
    if(token) {
      return this.getUserRoleFromToken(token) === UserRole.ADMIN ? true:false;
    }
    return false;
  }

  userIsUser(userIdFromParams: number): boolean {
    if (!this.isAuthenticated())  return false;
    const token = this.getToken();
    if (token) {
      const idFromToken = this.getUserIdFromToken(token);
      if(idFromToken) {
        return userIdFromParams === idFromToken ? true:false;
      }
    }
    return false;
  }

  fetchAndSetUserIdFromToken(): Observable<number | null> {
    if (this.isAuthenticated()) {
      const token = this.getToken();
    if (token) {
      const userId = this.getUserIdFromToken(token);
      this.updateUserId(token);
      return of(userId);
    }else {
      this.updateUserId(null);
      return of(null);
    }
    }else {
      this.updateUserId(null);
      return of(null);
    }
  }

  logout() {
    localStorage.removeItem(JWT_NAME);
    // comunicar el estado del usuario autenticado
    this.isLoggedSubject.next(false);
    //this.fetchAndSetUserIdFromToken().subscribe();
    // destruir el id 
    this.setBehaviorUserId(null);
  }

  setBehaviorUserId(userId: number | null): void {
    this.userIdSubject.next(userId);
  }

  getBehaviorUserId(): number | null {
    return this.userIdSubject.getValue();
  }

  private getToken(): string | null {
    return localStorage.getItem(JWT_NAME);
  }

  private getUserIdFromToken(jwt: string): number | null {
    try {
      const decoded = this.jwtHelper.decodeToken(jwt);
      return decoded?.user?.id || null;
    } catch (error) {
      return null;
    }
  }

  private getUserRoleFromToken(jwt: string): string | null {
    try {
      const decoded = this.jwtHelper.decodeToken(jwt);
      return decoded?.user?.role || null;
    } catch (error) {
      return null;
    }
  }

  private updateUserId(token: string | null): void {
    const userId = token ? this.getUserIdFromToken(token) : null;
    this.setBehaviorUserId(userId);
  }
}
