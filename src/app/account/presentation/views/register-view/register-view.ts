import { Component, inject, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserStore } from '../../../application/user-store';

@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register-view.html',
  styleUrl: './register-view.css',
})
export class RegisterView {
  private userStore = inject(UserStore);
  private router = inject(Router);

  name = '';
  lastName = '';
  email = '';
  password = '';
  birthDate = '';
  errorMessage = '';

  readonly error = this.userStore.error;
  readonly loading = this.userStore.loading;

  constructor() {
    effect(() => {
      if (this.userStore.user()) {
        this.router.navigate(['/app/dashboard']);
      }
    });
  }

  register(): void {
    if (!this.name || !this.lastName || !this.email || !this.password) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }

    this.errorMessage = '';
    const fullName = `${this.name} ${this.lastName}`;

    this.userStore.register(fullName, this.email, this.password, '', this.birthDate, '');
  }
}
