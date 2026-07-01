import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register-view.html',
  styleUrl: './register-view.css',
})
export class RegisterView {
  private http = inject(HttpClient);
  private router = inject(Router);

  name = '';
  lastName = '';
  email = '';
  password = '';
  birthDate = '';
  errorMessage = '';

  register(): void {
    if (!this.name || !this.lastName || !this.email || !this.password) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }

    const newUser = {
      name: `${this.name} ${this.lastName}`,
      email: this.email,
      password: this.password,
      role: 'Ciudadano verificado',
      currentLocation: '',
      avatar: '',
      phone: '',
    };

    const url = `${environment.serverBaseUrl}${environment.apiBasePath}${environment.usersEndpointPath}`;

    this.http.post(url, newUser).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => (this.errorMessage = 'Error al registrarse. Intenta de nuevo.'),
    });
  }
}
