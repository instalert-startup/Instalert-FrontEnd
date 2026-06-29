import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { UserStore } from '../../../../account/application/user-store';

interface UserAdmin {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userStore = inject(UserStore);

  users = signal<UserAdmin[]>([]);
  activeSection = signal<'users' | 'stats'>('users');

  get totalUsers() {
    return this.users().length;
  }
  get totalAdmins() {
    return this.users().filter((u) => u.role === 'Admin').length;
  }
  get totalCitizens() {
    return this.users().filter((u) => u.role !== 'Admin').length;
  }

  private url = `${environment.serverBaseUrl}${environment.apiBasePath}${environment.usersEndpointPath}`;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<UserAdmin[]>(this.url).subscribe({
      next: (data) => this.users.set(data),
      error: () => console.error('Error cargando usuarios'),
    });
  }

  changeRole(user: UserAdmin): void {
    const newRole = user.role === 'Admin' ? 'Ciudadano verificado' : 'Admin';
    this.http.put(`${this.url}/${user.id}/role`, { role: newRole }).subscribe({
      next: () => this.loadUsers(),
      error: () => console.error('Error cambiando rol'),
    });
  }

  deleteUser(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    this.http.delete(`${this.url}/${id}`).subscribe({
      next: () => this.loadUsers(),
      error: () => console.error('Error eliminando usuario'),
    });
  }

  logout(): void {
    this.userStore.logout();
    this.router.navigate(['/login']);
  }
}
