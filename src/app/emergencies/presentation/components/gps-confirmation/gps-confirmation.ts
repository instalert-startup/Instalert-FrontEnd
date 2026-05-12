import { Component, output } from '@angular/core';

@Component({
  selector: 'app-gps-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './gps-confirmation.html',
  styleUrl: './gps-confirmation.css'
})
export class GpsConfirmationComponent {
  onConfirm = output<void>();

  confirmLocation() {
    this.onConfirm.emit();
  }
}
