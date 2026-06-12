import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PanicButtonStore } from '../../../../emergencies/application/state/panic-button.store';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardViewComponent {
  public store = inject(PanicButtonStore);

  riskLevel: 'safe' | 'warning' | 'danger' = 'warning';

  connectedContacts = [
    { id: 1, name: 'Juan Pérez', distance: '0.8 km', risk: 'high', avatar: 'JP' },
    { id: 2, name: 'María López', distance: '1.5 km', risk: 'medium', avatar: 'ML' },
    { id: 3, name: 'Ricardo Díaz', distance: '3.2 km', risk: 'low', avatar: 'RD' }
  ];

  recentReports = [
    { id: 1, type: 'Actividad sospechosa', location: 'Av. Simón Bolívar 450', time: 'Hace 12 min', severity: 'medium' },
    { id: 2, type: 'Robo a transeúnte', location: 'Calle Tacna 120', time: 'Hace 45 min', severity: 'high' },
    { id: 3, type: 'Alumbrado público fallado', location: 'Parque de la Juventud', time: 'Hace 2 horas', severity: 'low' }
  ];
}
