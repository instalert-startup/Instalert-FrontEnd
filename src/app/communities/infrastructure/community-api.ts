import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrustedContact } from '../domain/trusted-contact.entity';

@Injectable({
  providedIn: 'root',
})
export class CommunityApi {
  private http = inject(HttpClient);
  private baseUrl = 'https://instalert-api-zdxk.onrender.com/api/v1/users';

  getUsers(): Observable<TrustedContact[]> {
    return this.http.get<TrustedContact[]>(this.baseUrl);
  }
}
