import { Injectable } from '@angular/core';
import { PermissionState } from '../domain/emergency-alert.entity';

@Injectable({ providedIn: 'root' })
export class EmergencyApi {
  private readonly PERM_KEY = 'instalert_location_permission';
  private readonly LOC_KEY = 'instalert_location_confirmed';

  getPermissionStatus(): PermissionState {
    return (localStorage.getItem(this.PERM_KEY) as PermissionState) || 'pending';
  }

  savePermissionStatus(state: PermissionState): void {
    localStorage.setItem(this.PERM_KEY, state);
  }

  getLocationConfirmed(): boolean {
    return localStorage.getItem(this.LOC_KEY) === 'true';
  }

  saveLocationConfirmed(status: boolean): void {
    localStorage.setItem(this.LOC_KEY, String(status));
  }
}
