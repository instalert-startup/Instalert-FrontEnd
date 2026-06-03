import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../domain/model/user-profile.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);
  private url = `${environment.serverBaseUrl}${environment.apiBasePath}${environment.usersEndpointPath}`;

  getUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.url);
  }

  getUserById(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.url}/${id}`);
  }

  updateUser(user: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.url}/${user.id}`, user);
  }
}
