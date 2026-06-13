import { Component, inject, effect, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserStore } from '../../../application/user-store';
import { UserProfile } from '../../../domain/model/user-profile.entity';

@Component({
  selector: 'app-profile-settings-view',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './profile-settings-view.html',
  styleUrl: './profile-settings-view.css',
})
export class ProfileSettingsView implements OnInit {
  private readonly userStore = inject(UserStore);

  readonly loading = this.userStore.loading;
  readonly storeError = this.userStore.error;

  showSuccessMessage = false;

  firstName = '';
  lastName = '';
  phone = '';
  email = '';
  birthDate = '';
  gender = '';

  get avatarInitials(): string {
    const parts = [this.firstName, this.lastName].filter(Boolean);
    return parts.map((w) => w[0]).join('').toUpperCase() || '?';
  }

  constructor() {
    effect(() => {
      if (this.userStore.updateSuccess()) {
        this.showSuccessMessage = true;
      }
    });
  }

  ngOnInit(): void {
    this.syncFromStore();
  }

  private syncFromStore(): void {
    const user = this.userStore.user();
    if (!user) return;
    const [first = '', ...rest] = user.name.split(' ');
    this.firstName = first;
    this.lastName = rest.join(' ');
    this.phone = user.phone;
    this.email = user.email;
    this.birthDate = user.birthDate ?? '';
    this.gender = user.gender ?? '';
  }

  saveChanges(): void {
    const user = this.userStore.user();
    if (!user) return;

    this.showSuccessMessage = false;

    const updated: UserProfile = {
      ...user,
      name: [this.firstName, this.lastName].filter(Boolean).join(' '),
      phone: this.phone,
      email: this.email,
      birthDate: this.birthDate || undefined,
      gender: this.gender || undefined,
    };

    this.userStore.updateUser(updated);
  }

  closeSuccessMessage(): void {
    this.showSuccessMessage = false;
  }

  cancel(): void {
    this.showSuccessMessage = false;
    this.syncFromStore();
  }
}
