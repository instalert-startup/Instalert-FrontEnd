import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrustedContact } from '../domain/trusted-contact.entity';
import { SupportRequest } from '../domain/support-request.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommunityApi {
  private http = inject(HttpClient);
  private contactsUrl = `${environment.serverBaseUrl}${environment.apiBasePath}${environment.trustedContactsEndpointPath}`;
  private supportUrl = `${environment.serverBaseUrl}${environment.apiBasePath}${environment.supportRequestsEndpointPath}`;

  getContacts(): Observable<TrustedContact[]> {
    return this.http.get<TrustedContact[]>(this.contactsUrl);
  }

  createContact(contact: Omit<TrustedContact, 'id'>): Observable<TrustedContact> {
    return this.http.post<TrustedContact>(this.contactsUrl, contact);
  }

  updateContact(contact: TrustedContact): Observable<TrustedContact> {
    return this.http.put<TrustedContact>(`${this.contactsUrl}/${contact.id}`, contact);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.contactsUrl}/${id}`);
  }

  getSupportRequests(): Observable<SupportRequest[]> {
    return this.http.get<SupportRequest[]>(this.supportUrl);
  }

  createSupportRequest(request: Omit<SupportRequest, 'id'>): Observable<SupportRequest> {
    return this.http.post<SupportRequest>(this.supportUrl, request);
  }
}
