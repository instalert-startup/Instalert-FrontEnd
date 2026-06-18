import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthApi } from '../infrastructure/auth-api';
import { UserProfile } from '../domain/model/user-profile.entity';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private api = inject(AuthApi);

  private readonly userSignal = signal<UserProfile | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly successSignal = signal<string | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly success = this.successSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.userSignal() !== null);

  login(email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getUsers().subscribe({
      next: (users) => {
        const found = users.find((u) => u.email === email && (u as any).password === password);
        if (found) {
          this.userSignal.set(found);
          localStorage.setItem('instalert_user', JSON.stringify(found));
        } else {
          this.errorSignal.set('Correo o contraseña incorrectos');
        }
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('Error al conectar con el servidor');
        this.loadingSignal.set(false);
      },
    });
  }

  logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem('instalert_user');
  }

  loadFromStorage(): void {
    const saved = localStorage.getItem('instalert_user');
    if (saved) this.userSignal.set(JSON.parse(saved));
  }

  updateProfile(email: string, phone: string, birthDate: string, gender: string): void {
    const current = this.userSignal();
    if (!current) return;

    this.errorSignal.set(null);
    this.successSignal.set(null);

    this.api.updateUser(current.id, { email, phone, birthDate, gender }).subscribe({
      next: (updated) => {
        this.userSignal.set(updated);
        localStorage.setItem('instalert_user', JSON.stringify(updated));
        this.successSignal.set('Perfil actualizado correctamente');
      },
      error: () => this.errorSignal.set('Error al actualizar el perfil'),
    });
  }

  changePassword(currentPassword: string, newPassword: string): void {
    const current = this.userSignal();
    if (!current) return;

    this.errorSignal.set(null);
    this.successSignal.set(null);

    this.api.changePassword(current.id, currentPassword, newPassword).subscribe({
      next: () => this.successSignal.set('Contraseña actualizada correctamente'),
      error: () => this.errorSignal.set('La contraseña actual no es correcta'),
    });
  }

  clearMessages(): void {
    this.errorSignal.set(null);
    this.successSignal.set(null);
  }
}
