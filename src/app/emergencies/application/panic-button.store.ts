import { Injectable, signal, computed, inject } from '@angular/core';
import { AlertHistory, PermissionState, DashboardState } from '../domain/emergency-alert.entity';
import { EmergencyApi } from '../infrastructure/emergency-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class PanicButtonStore {
  private api = inject(EmergencyApi);

  readonly permissionState = signal<PermissionState>(this.api.getPermissionStatus());
  readonly locationConfirmed = signal<boolean>(this.api.getLocationConfirmed());
  readonly dashboardState = signal<DashboardState>('idle');
  readonly alertHistory = signal<AlertHistory[]>([]);
  readonly lastCanceledTime = signal<string>('');

  constructor() {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.api
      .getEmergencies()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          const history: AlertHistory[] = data.map((e) => ({
            id: e.id,
            type: e.type,
            location: e.location,
            time: e.time,
            status: e.status,
            statusClass: e.statusClass,
          }));
          this.alertHistory.set(history);
        },
        error: () => console.error('Error al cargar historial de emergencias'),
      });
  }

  setPermission(granted: boolean): void {
    const state = granted ? 'granted' : 'denied';
    this.permissionState.set(state);
    this.api.savePermissionStatus(state);
  }

  confirmLocation(): void {
    this.locationConfirmed.set(true);
    this.api.saveLocationConfirmed(true);
  }

  dispatchAlert(): void {
    this.dashboardState.set('active');
  }

  cancelAlert(): void {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullTimeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    this.lastCanceledTime.set(fullTimeStr);

    const newAlert: AlertHistory = {
      id: Date.now(),
      type: 'Botón de pánico (Emergencia)',
      location: 'Av. Francisco Masias 251',
      time: timeStr,
      status: 'Cancelada',
      statusClass: 'badge-canceled',
    };

    this.api.createEmergency(newAlert).subscribe();
    this.alertHistory.update((history) => [newAlert, ...history]);
    this.dashboardState.set('canceled');
  }

  resetToIdle(): void {
    this.dashboardState.set('idle');
  }
}
