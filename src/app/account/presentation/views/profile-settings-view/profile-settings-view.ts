import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile-settings-view',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './profile-settings-view.html',
  styleUrl: './profile-settings-view.css',
})
export class ProfileSettingsView {
  showSuccessMessage = true;

  firstName = 'María';
  lastName = 'Rodríguez';
  phone = '987 654 321';
  email = 'maria.rodriguez@gmail.com';
  birthDate = '15/06/1990';
  gender = 'Femenino';
  language = 'Español';

  saveChanges(): void {
    this.showSuccessMessage = true;
  }

  closeSuccessMessage(): void {
    this.showSuccessMessage = false;
  }

  cancel(): void {
    this.firstName = 'María';
    this.lastName = 'Rodríguez';
    this.phone = '987 654 321';
    this.email = 'maria.rodriguez@gmail.com';
    this.birthDate = '15/06/1990';
    this.gender = 'Femenino';
    this.language = 'Español';
  }
}
