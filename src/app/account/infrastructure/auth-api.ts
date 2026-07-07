import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, AuthenticatedUser } from '../domain/model/user-profile.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);
  private usersUrl = `${environment.serverBaseUrl}${environment.apiBasePath}${environment.usersEndpointPath}`;
  private authUrl = `${environment.serverBaseUrl}${environment.apiBasePath}${environment.authenticationEndpointPath}`;

  getUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.usersUrl);
  }

  getUserById(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.usersUrl}/${id}`);
  }

  signIn(email: string, password: string): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>(`${this.authUrl}/sign-in`, { email, password });
  }

  signUp(email: string, password: string): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>(`${this.authUrl}/sign-up`, {
      email,
      password,
      roles: ['ROLE_USER'],
    });
  }

  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/${userId}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  createProfile(profile: {
    id: number;
    name: string;
    email: string;
    role: string;
    currentLocation: string;
    avatar: string;
    phone: string;
    birthDate: string;
    gender: string;
  }): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.usersUrl, profile);
  }

  updateUser(
    id: number,
    data: { email: string; phone: string; birthDate: string; gender: string },
  ): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.usersUrl}/${id}`, data);
  }
}
