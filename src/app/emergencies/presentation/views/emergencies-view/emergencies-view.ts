import { Component, inject } from '@angular/core';
import { PanicButtonStore } from '../../../application/panic-button.store';
import { LocationPermissionModal } from '../../components/location-permission-modal/location-permission-modal';
import { GpsConfirmationComponent } from '../../components/gps-confirmation/gps-confirmation';
import { PanicButtonComponent } from '../../components/panic-button/panic-button';
import { ActiveAlertStatusComponent } from '../../components/active-alert-status/active-alert-status';

@Component({
  selector: 'app-emergencies-view',
  standalone: true,
  imports: [
    LocationPermissionModal,
    GpsConfirmationComponent,
    PanicButtonComponent,
    ActiveAlertStatusComponent
  ],
  templateUrl: './emergencies-view.html',
  styleUrl: './emergencies-view.css'
})
export class EmergenciesViewComponent {
  public store = inject(PanicButtonStore);

  handlePermissionDecision(granted: boolean) {
    this.store.setPermission(granted);
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
