import { Component, inject, OnInit } from '@angular/core';
import { PanicButtonStore } from '../../../application/state/panic-button.store';
import { LocationPermissionModal } from '../../components/location-permission-modal/location-permission-modal';
import { GpsConfirmationComponent } from '../../components/gps-confirmation/gps-confirmation';
import { PanicButtonComponent } from '../../components/panic-button/panic-button';
import { ActiveAlertStatusComponent } from '../../components/active-alert-status/active-alert-status';
import { AlertHistoryListComponent } from '../../components/alert-history-list/alert-history-list';
import { EmergencyMapComponent } from '../../components/emergency-map/emergency-map';

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
  public isFetchingLocation = false;

  ngOnInit() {
    this.store.loadHistory();
    if (this.store.permissionState() === 'granted') {
      this.fetchLocation();
    }
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
