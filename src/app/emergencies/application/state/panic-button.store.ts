import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AlertHistory,
  PermissionState,
  DashboardState,
} from '../../domain/entities/emergency-alert.entity';
import { BrowserGeolocationAdapter } from '../../infrastructure/adapters/browser-geolocation.adapter';
import { EmergencyHttpAdapter } from '../../infrastructure/adapters/emergency-http.adapter';
import { Geolocation } from '../../domain/value-objects/geolocation.value-object';

@Injectable({ providedIn: 'root' })
export class PanicButtonStore {
  private geolocationAdapter = inject(BrowserGeolocationAdapter);
  private httpAdapter = inject(EmergencyHttpAdapter);

  readonly permissionState = signal<PermissionState>('pending');
  readonly locationConfirmed = signal<boolean>(false);
  readonly dashboardState = signal<DashboardState>('idle');
  readonly alertHistory = signal<AlertHistory[]>([]);
  readonly lastCanceledTime = signal<string>('');
  readonly currentLocation = signal<Geolocation | null>(null);
  readonly activeAlertId = signal<number | null>(null);

  async loadHistory() {
    try {
      const history = await firstValueFrom(this.httpAdapter.getHistory());
      this.alertHistory.set(history.reverse());
    } catch (error) {
      this.alertHistory.set([]);
    }
  }

  setPermission(granted: boolean) {
    this.permissionState.set(granted ? 'granted' : 'denied');
  }

  async requestLocation() {
    try {
      const location = await this.geolocationAdapter.getCurrentLocation();
      this.currentLocation.set(location);
    } catch (error) {
      throw error;
    }
  }

  confirmLocation() {
    if (this.currentLocation()) {
      this.locationConfirmed.set(true);
    }
  }

  async dispatchAlert() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEmergency: Partial<AlertHistory> = {
      userId: 1,
      type: 'Botón de pánico (Emergencia)',
      location: this.currentLocation() ? this.currentLocation()!.format() : 'Ubicación desconocida',
      time: timeStr,
      status: 'Activa',
      statusClass: 'badge-active',
      createdAt: now.toISOString(),
    };

    try {
      const savedEmergency = await firstValueFrom(this.httpAdapter.saveEmergency(newEmergency));
      this.activeAlertId.set(savedEmergency.id);
      this.alertHistory.update((history) => [savedEmergency, ...history]);
      this.dashboardState.set('active');
    } catch (error) {
      this.dashboardState.set('active');
    }
  }

  async cancelAlert() {
    const currentId = this.activeAlertId();
    if (!currentId) return;

    const now = new Date();
    const fullTimeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.lastCanceledTime.set(fullTimeStr);

    try {
      const updatedEmergency = await firstValueFrom(
        this.httpAdapter.updateEmergencyStatus(currentId, 'Cancelada', 'badge-canceled'),
      );

      this.alertHistory.update((history) =>
        history.map((alert) => (alert.id === currentId ? updatedEmergency : alert)),
      );
    } catch (error) {
      this.alertHistory.update((history) =>
        history.map((alert) =>
          alert.id === currentId
            ? { ...alert, status: 'Cancelada', statusClass: 'badge-canceled' }
            : alert,
        ),
      );
    }

    this.activeAlertId.set(null);
    this.dashboardState.set('canceled');
  }

  resetToIdle() {
    this.dashboardState.set('idle');
  }
}
