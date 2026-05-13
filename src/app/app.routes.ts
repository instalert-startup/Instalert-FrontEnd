import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./shared/presentation/views/dashboard/dashboard').then(m => m.DashboardViewComponent)
  },
  {
    path: 'boton-panico',
    loadComponent: () => import('./emergencies/presentation/views/emergencies-view/emergencies-view').then(m => m.EmergenciesViewComponent)
  },
  {
    path: 'mapa-riesgo',
    loadComponent: () => import('./incidents/presentation/views/risk-map-view/risk-map-view').then(m => m.RiskMapViewComponent)
  },
  {
    path: 'reportes',
    loadComponent: () => import('./incidents/presentation/views/report-views/report-views').then(m => m.ReportesComponent)
  },
  {
    path: 'crear-reporte',
    loadComponent: () => import('./incidents/presentation/views/create-report/create-report').then(m => m.CrearReporteComponent)
  },
  {
    path: 'comunidades',
    loadComponent: () => import('./communities/presentation/views/community-setup-view/community-setup-view').then(m => m.CommunitySetupViewComponent)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./account/presentation/views/profile-view/profile-view').then(m => m.ProfileViewComponent)
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./account/presentation/views/setting-view/setting-view').then(m => m.SettingsViewComponent)
  },

  {
    // Ruta por defecto: Redirige al al dashboard al abrir la app
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
