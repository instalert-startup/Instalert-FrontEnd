import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-view.html',
  styleUrl: './register-view.css',
})
export class RegisterView {
  name = '';
  lastName = '';
  email = '';
  birthDate = '';
  errorMessage = '';

  constructor(private router: Router) {}

  register(): void {
    if (!this.name || !this.lastName || !this.email || !this.birthDate) {
      this.errorMessage = 'Completa todos los campos para registrarte.';
      return;
    }

    this.errorMessage = '';
    this.router.navigate(['/login']);
  }
}
