import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, from } from 'rxjs';

const BASE_URL = environment.API_URL;
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  userExists(email: string): Observable<boolean> {
    console.log('### email: ', email);
    return from(this.http.post<any>(`${BASE_URL}/api/users/exist`, {email: email.toLowerCase()}));
  }
}
