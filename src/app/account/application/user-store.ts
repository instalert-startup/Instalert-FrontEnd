import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthApi } from '../infrastructure/auth-api';
import { UserProfile } from '../domain/model/user-profile.entity';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private api = inject(AuthApi);

  private readonly userSignal = signal<UserProfile | null>(null);
  private readonly tokenSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly successSignal = signal<string | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly success = this.successSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.userSignal() !== null);

  login(email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.signIn(email, password).subscribe({
      next: (authResult) => {
        this.tokenSignal.set(authResult.token);
        localStorage.setItem('instalert_token', authResult.token);

        this.api.getUserById(authResult.id).subscribe({
          next: (profile) => {
            this.userSignal.set(profile);
            localStorage.setItem('instalert_user', JSON.stringify(profile));
            this.loadingSignal.set(false);
          },
          error: () => {
            this.errorSignal.set('No se pudo cargar el perfil');
            this.loadingSignal.set(false);
          },
        });
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorSignal.set('Correo o contraseña incorrectos');
        } else {
          this.errorSignal.set('Error al conectar con el servidor');
        }
        this.loadingSignal.set(false);
      },
    });
  }

  register(
    name: string,
    email: string,
    password: string,
    phone: string,
    birthDate: string,
    gender: string,
  ): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.signUp(email, password).subscribe({
      next: (authResult) => {
        this.tokenSignal.set(authResult.token);
        localStorage.setItem('instalert_token', authResult.token);

        this.api
          .createProfile({
            id: authResult.id,
            name,
            email,
            role: 'Ciudadano verificado',
            currentLocation: '',
            avatar: '',
            phone,
            birthDate,
            gender,
          })
          .subscribe({
            next: (profile) => {
              this.userSignal.set(profile);
              localStorage.setItem('instalert_user', JSON.stringify(profile));
              this.loadingSignal.set(false);
              this.successSignal.set('Registro exitoso');
            },
            error: () => {
              this.errorSignal.set('Error al crear el perfil');
              this.loadingSignal.set(false);
            },
          });
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorSignal.set('Ese correo ya está registrado');
        } else {
          this.errorSignal.set('Error al registrarse');
        }
        this.loadingSignal.set(false);
      },
    });
  }

  logout(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    localStorage.removeItem('instalert_user');
    localStorage.removeItem('instalert_token');
  }

  loadFromStorage(): void {
    const saved = localStorage.getItem('instalert_user');
    const token = localStorage.getItem('instalert_token');
    if (saved) this.userSignal.set(JSON.parse(saved));
    if (token) this.tokenSignal.set(token);
  }
  changePassword(currentPassword: string, newPassword: string): void {
    const current = this.userSignal();
    if (!current) return;

    this.errorSignal.set(null);
    this.successSignal.set(null);

    this.api.changePassword(current.id, currentPassword, newPassword).subscribe({
      next: () => this.successSignal.set('Contraseña actualizada correctamente'),
      error: (err) => {
        if (err.status === 404) {
          this.errorSignal.set('Usuario no encontrado');
        } else {
          this.errorSignal.set('La contraseña actual no es correcta');
        }
      },
    });
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

  clearMessages(): void {
    this.errorSignal.set(null);
    this.successSignal.set(null);
  }
}
