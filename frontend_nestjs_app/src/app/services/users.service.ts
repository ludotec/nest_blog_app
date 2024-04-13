import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, IUsersPaginated } from 'app/interfaces/user';
import { environment } from 'environments/environment';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  findAll(page=1, limit=10): Observable<IUsersPaginated> {
    let params = new HttpParams();

    params = params.append('page', Number(page));
    params = params.append('limit', Number(limit));

    return this.http.get<IUsersPaginated>(`${BASE_URL}/api/users`, {params}).pipe(
      map((userPaginated: IUsersPaginated) => {
        console.log('## user paginated: ', userPaginated);
        return userPaginated;
      }),
      catchError(err => throwError(() => new Error(err)))
    );
  }

  findOne(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${BASE_URL}/api/users/${id}`).pipe(
      map((user: IUser) => user)
    );
  }

  paginateByName(page: number, size: number, name: string): Observable<IUsersPaginated> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(size));
    params = params.append('name', name);

    return this.http.get<IUsersPaginated>(`${BASE_URL}/api/users`, {params}).pipe(
      map((userData: IUsersPaginated) => userData),
      catchError(err => throwError(() => new Error(err)))  
    );
  }

  updateOne(user: IUser): Observable<IUser> {
    return this.http.put(`${BASE_URL}/api/users/${user.id}`, user).pipe(
      map((user: IUser) => user));
  }
}
