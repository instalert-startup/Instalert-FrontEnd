import { Injectable, inject, signal } from '@angular/core';
import { CommunityApi } from '../infrastructure/community-api';
import { TrustedContact } from '../domain/trusted-contact.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ContactManagementStore {
  private api = inject(CommunityApi);

  private readonly contactsSignal = signal<TrustedContact[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly contacts = this.contactsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.loadContacts();
  }

  loadContacts(): void {
    this.loadingSignal.set(true);
    this.api
      .getContacts()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this.contactsSignal.set(data);
          this.loadingSignal.set(false);
        },
        error: () => {
          this.errorSignal.set('Error al cargar contactos');
          this.loadingSignal.set(false);
        },
      });
  }

  addContact(contact: Omit<TrustedContact, 'id'>): void {
    this.api.createContact(contact).subscribe({
      next: (created) => this.contactsSignal.update((list) => [...list, created]),
      error: () => this.errorSignal.set('Error al agregar contacto'),
    });
  }

  updateContact(contact: TrustedContact): void {
    this.api.updateContact(contact).subscribe({
      next: (updated) =>
        this.contactsSignal.update((list) => list.map((c) => (c.id === updated.id ? updated : c))),
      error: () => this.errorSignal.set('Error al actualizar contacto'),
    });
  }

  deleteContact(id: number): void {
    this.api.deleteContact(id).subscribe({
      next: () => this.contactsSignal.update((list) => list.filter((c) => c.id !== id)),
      error: () => this.errorSignal.set('Error al eliminar contacto'),
    });
  }
}
