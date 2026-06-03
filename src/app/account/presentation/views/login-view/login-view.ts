import { Component, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserStore } from '../../../application/user-store';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login-view.html',
  styleUrl: './login-view.css',
})
export class LoginView {
  private userStore = inject(UserStore);
  private router = inject(Router);

  email = '';
  password = '';

  readonly error = this.userStore.error;
  readonly loading = this.userStore.loading;

  constructor() {
    effect(() => {
      if (this.userStore.user()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  login(): void {
    if (!this.email || !this.password) return;
    this.userStore.login(this.email, this.password);
  }
}
