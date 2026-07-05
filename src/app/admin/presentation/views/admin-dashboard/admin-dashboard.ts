import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  birthDate?: string;
  gender?: string;
}

interface IncidentAdmin {
  id: number;
  type: string;
  severity: string;
  address: string;
  description: string;
  status: string;
  timeReported: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userStore = inject(UserStore);

  users = signal<UserAdmin[]>([]);
  incidents = signal<IncidentAdmin[]>([]);
  activeSection = signal<'users' | 'incidents' | 'stats'>('users');

  editingUser = signal<UserAdmin | null>(null);
  editEmail = '';
  editPhone = '';
  editBirthDate = '';
  editGender = '';

  get totalUsers() {
    return this.users().length;
  }
  get totalAdmins() {
    return this.users().filter((u) => u.role === 'Admin').length;
  }
  get totalCitizens() {
    return this.users().filter((u) => u.role !== 'Admin').length;
  }

  get totalIncidents() {
    return this.incidents().length;
  }
  get activeIncidents() {
    return this.incidents().filter((i) => i.status === 'ACTIVE').length;
  }
  get resolvedIncidents() {
    return this.incidents().filter((i) => i.status === 'RESOLVED').length;
  }

  get severityBreakdown() {
    const total = this.incidents().length || 1;
    const high = this.incidents().filter((i) => i.severity === 'HIGH').length;
    const medium = this.incidents().filter((i) => i.severity === 'MEDIUM').length;
    const low = this.incidents().filter((i) => i.severity === 'LOW').length;
    return [
      { label: 'Alta', count: high, pct: Math.round((high / total) * 100), color: '#ef3b3b' },
      { label: 'Media', count: medium, pct: Math.round((medium / total) * 100), color: '#f59e0b' },
      { label: 'Baja', count: low, pct: Math.round((low / total) * 100), color: '#10b981' },
    ];
  }

  get roleBreakdown() {
    const total = this.users().length || 1;
    return [
      {
        label: 'Admins',
        count: this.totalAdmins,
        pct: Math.round((this.totalAdmins / total) * 100),
        color: '#ef3b3b',
      },
      {
        label: 'Ciudadanos',
        count: this.totalCitizens,
        pct: Math.round((this.totalCitizens / total) * 100),
        color: '#3b82f6',
      },
    ];
  }

  get statusBreakdown() {
    const total = this.incidents().length || 1;
    return [
      {
        label: 'Activos',
        count: this.activeIncidents,
        pct: Math.round((this.activeIncidents / total) * 100),
        color: '#ef3b3b',
      },
      {
        label: 'Resueltos',
        count: this.resolvedIncidents,
        pct: Math.round((this.resolvedIncidents / total) * 100),
        color: '#10b981',
      },
    ];
  }

  private usersUrl = `${environment.serverBaseUrl}${environment.apiBasePath}${environment.usersEndpointPath}`;
  private incidentsUrl = `${environment.serverBaseUrl}${environment.apiBasePath}${environment.incidentsEndpointPath}`;

  ngOnInit(): void {
    this.loadUsers();
    this.loadIncidents();
  }

  loadUsers(): void {
    this.http.get<UserAdmin[]>(this.usersUrl).subscribe({
      next: (data) => this.users.set(data),
      error: () => console.error('Error cargando usuarios'),
    });
  }

  loadIncidents(): void {
    this.http.get<IncidentAdmin[]>(this.incidentsUrl).subscribe({
      next: (data) => this.incidents.set(data),
      error: () => console.error('Error cargando incidentes'),
    });
  }

  changeRole(user: UserAdmin): void {
    const newRole = user.role === 'Admin' ? 'Ciudadano verificado' : 'Admin';
    this.http.put(`${this.usersUrl}/${user.id}/role`, { role: newRole }).subscribe({
      next: () => this.loadUsers(),
      error: () => console.error('Error cambiando rol'),
    });
  }

  deleteUser(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    this.http.delete(`${this.usersUrl}/${id}`).subscribe({
      next: () => this.loadUsers(),
      error: () => console.error('Error eliminando usuario'),
    });
  }

  openEditUser(user: UserAdmin): void {
    this.editingUser.set(user);
    this.editEmail = user.email;
    this.editPhone = user.phone || '';
    this.editBirthDate = user.birthDate || '';
    this.editGender = user.gender || '';
  }

  closeEditUser(): void {
    this.editingUser.set(null);
  }

  saveUserEdit(): void {
    const user = this.editingUser();
    if (!user) return;

    this.http
      .put(`${this.usersUrl}/${user.id}`, {
        email: this.editEmail,
        phone: this.editPhone,
        birthDate: this.editBirthDate,
        gender: this.editGender,
      })
      .subscribe({
        next: () => {
          this.loadUsers();
          this.closeEditUser();
        },
        error: () => console.error('Error actualizando usuario'),
      });
  }

  toggleIncidentStatus(incident: IncidentAdmin): void {
    const newStatus = incident.status === 'ACTIVE' ? 'RESOLVED' : 'ACTIVE';
    this.http.put(`${this.incidentsUrl}/${incident.id}/status`, { status: newStatus }).subscribe({
      next: () => this.loadIncidents(),
      error: () => console.error('Error cambiando estado del incidente'),
    });
  }

  deleteIncident(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este reporte?')) return;
    this.http.delete(`${this.incidentsUrl}/${id}`).subscribe({
      next: () => this.loadIncidents(),
      error: () => console.error('Error eliminando incidente'),
    });
  }

  logout(): void {
    this.userStore.logout();
    this.router.navigate(['/login']);
  }
}
