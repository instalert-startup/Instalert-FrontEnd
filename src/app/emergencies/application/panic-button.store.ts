import { Injectable, signal, computed, inject } from '@angular/core';
import { AlertHistory, PermissionState, DashboardState } from '../domain/emergency-alert.entity';
import { EmergencyApi } from '../infrastructure/emergency-api';

@Injectable({ providedIn: 'root' })
export class PanicButtonStore {
  private api = inject(EmergencyApi);

  // Estados
  readonly permissionState = signal<PermissionState>(this.api.getPermissionStatus());
  readonly locationConfirmed = signal<boolean>(this.api.getLocationConfirmed());
  readonly dashboardState = signal<DashboardState>('idle');
  readonly alertHistory = signal<AlertHistory[]>([
    { id: 1, type: 'Robo a mano armada', location: 'Jr. Moquegua 240', time: '14:32', status: 'Cancelada', statusClass: 'badge-canceled' }
  ]);
  readonly lastCanceledTime = signal<string>('');

  // Acciones (Lógica de negocio)
  setPermission(granted: boolean) {
    const state = granted ? 'granted' : 'denied';
    this.permissionState.set(state);
    this.api.savePermissionStatus(state);
  }

  confirmLocation() {
    this.locationConfirmed.set(true);
    this.api.saveLocationConfirmed(true);
  }

  dispatchAlert() {
    this.dashboardState.set('active');
  }

  cancelAlert() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    this.lastCanceledTime.set(fullTimeStr);

    const newAlert: AlertHistory = {
      id: Date.now(),
      type: 'Botón de pánico (Emergencia)',
      location: 'Av. Francisco Masias 251',
      time: timeStr,
      status: 'Cancelada',
      statusClass: 'badge-canceled'
    };

    this.alertHistory.update(history => [newAlert, ...history]);
    this.dashboardState.set('canceled');
  }

  resetToIdle() {
    this.dashboardState.set('idle');
  }
}
