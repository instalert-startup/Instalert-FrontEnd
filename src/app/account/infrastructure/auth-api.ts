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

  login(email: string, password: string): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.url}/login`, { email, password });
  }

  updateUser(
    id: number,
    data: { email: string; phone: string; birthDate: string; gender: string },
  ): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.url}/${id}`, data);
  }

  changePassword(id: number, currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}/password`, { currentPassword, newPassword });
  }
}
