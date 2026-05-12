import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [],
  template: `
    <div style="color: white;">
      <h2>Dashboard Principal</h2>
      <p>Aquí irá el panel de control resumiendo las alertas y estadísticas.</p>
    </div>
  `
})
export class DashboardViewComponent {}
