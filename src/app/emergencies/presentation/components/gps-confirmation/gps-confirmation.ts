import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-gps-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './gps-confirmation.html',
  styleUrl: './gps-confirmation.css',
})
export class GpsConfirmationComponent {
  latitude = input<number | undefined>();
  longitude = input<number | undefined>();
  accuracy = input<number | undefined>();

  address = input<string | undefined>();

  isLoading = input<boolean>(false);

  onConfirm = output<void>();
  onRequestLocation = output<void>();

  confirmLocation() {
    this.onConfirm.emit();
  }

  refreshLocation() {
    this.onRequestLocation.emit();
  }
}
