import { Injectable, inject, signal } from '@angular/core';
import { CommunityApi } from '../infrastructure/community-api';
import { SupportRequest } from '../domain/support-request.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class CommunitySupportStore {
  private api = inject(CommunityApi);

  private readonly requestsSignal = signal<SupportRequest[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly requests = this.requestsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loadingSignal.set(true);
    this.api
      .getSupportRequests()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this.requestsSignal.set(data);
          this.loadingSignal.set(false);
        },
        error: () => {
          this.errorSignal.set('Error al cargar solicitudes');
          this.loadingSignal.set(false);
        },
      });
  }

  createRequest(request: Omit<SupportRequest, 'id'>): void {
    this.api.createSupportRequest(request).subscribe({
      next: (created) => this.requestsSignal.update((list) => [...list, created]),
      error: () => this.errorSignal.set('Error al crear solicitud'),
    });
  }
}
