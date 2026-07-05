import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PanicButtonStore } from '../../../application/state/panic-button.store';
import { LocationPermissionModal } from '../../components/location-permission-modal/location-permission-modal';
import { GpsConfirmationComponent } from '../../components/gps-confirmation/gps-confirmation';
import { PanicButtonComponent } from '../../components/panic-button/panic-button';
import { ActiveAlertStatusComponent } from '../../components/active-alert-status/active-alert-status';
import { AlertHistoryListComponent } from '../../components/alert-history-list/alert-history-list';
import { EmergencyMapComponent } from '../../components/emergency-map/emergency-map';
import { environment } from '../../../../../environments/environment';

interface NearbyIncident {
  id: number;
  type: string;
  address: string;
  status: string;
  timeReported: string;
  severity: string;
}

@Component({
  selector: 'app-emergencies-view',
  standalone: true,
  imports: [
    LocationPermissionModal,
    GpsConfirmationComponent,
    PanicButtonComponent,
    ActiveAlertStatusComponent,
    AlertHistoryListComponent,
    EmergencyMapComponent,
  ],
  templateUrl: './emergencies-view.html',
  styleUrl: './emergencies-view.css',
})
export class EmergenciesViewComponent implements OnInit {
  public store = inject(PanicButtonStore);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  public isFetchingLocation = false;
  public nearbyIncidents: NearbyIncident[] = [];
  public activeIncidentsCount = 0;
  public totalUsersCount = 0;

  ngOnInit() {
    this.store.loadHistory();
    if (this.store.permissionState() === 'granted') {
      this.fetchLocation();
    }
    this.loadNearbyIncidents();
    this.loadUsersCount();
  }

  private loadNearbyIncidents() {
    const url = `${environment.serverBaseUrl}${environment.apiBasePath}${environment.incidentsEndpointPath}`;
    this.http.get<NearbyIncident[]>(url).subscribe({
      next: (incidents) => {
        this.activeIncidentsCount = incidents.filter((i) => i.status === 'ACTIVE').length;

        this.nearbyIncidents = incidents.slice().reverse().slice(0, 3);

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando incidentes cercanos', err),
    });
  }

  private loadUsersCount() {
    const url = `${environment.serverBaseUrl}${environment.apiBasePath}${environment.usersEndpointPath}`;
    this.http.get<any[]>(url).subscribe({
      next: (users) => {
        this.totalUsersCount = users.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  timeAgo(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `Hace ${diffHrs} h`;
    const diffDays = Math.floor(diffHrs / 24);
    return `Hace ${diffDays} d`;
  }

  handlePermissionDecision(granted: boolean) {
    this.store.setPermission(granted);
    if (granted) {
      this.fetchLocation();
    }
  }

  async fetchLocation() {
    this.isFetchingLocation = true;
    try {
      await this.store.requestLocation();
    } catch (error) {
    } finally {
      this.isFetchingLocation = false;
    }
  }

  handleLocationConfirmed() {
    this.store.confirmLocation();
  }

  handleAlertDispatch() {
    this.store.dispatchAlert();
  }

  handleCancelAlert() {
    this.store.cancelAlert();
  }

  returnToDashboard() {
    this.store.resetToIdle();
  }
}
