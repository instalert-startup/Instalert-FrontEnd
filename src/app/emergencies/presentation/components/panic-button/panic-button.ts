import { Component, output } from '@angular/core';

@Component({
  selector: 'app-panic-button',
  standalone: true,
  imports: [],
  templateUrl: './panic-button.html',
  styleUrl: './panic-button.css'
})
export class PanicButtonComponent {
  alertConfirmed = output<void>();
  showConfirmation = false;

  triggerClick() {
    this.showConfirmation = true;
  }

  cancel() {
    this.showConfirmation = false;
  }

  confirm() {
    this.showConfirmation = false;
    this.alertConfirmed.emit();
  }
}
