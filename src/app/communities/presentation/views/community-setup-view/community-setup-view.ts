import { AfterViewInit, Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import * as L from 'leaflet';

interface NearbyUser {
  name: string;
  distance: string;
  available: boolean;
}

@Component({
  selector: 'app-community-setup-view',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './community-setup-view.html',
  styleUrl: './community-setup-view.css',
})
export class CommunitySetupView implements AfterViewInit {
  supportSent = false;
  private map!: L.Map;

  nearbyUsers: NearbyUser[] = [
    { name: 'Carlos Mendoza', distance: 'A 200 m de ti', available: true },
    { name: 'Lucía Fernández', distance: 'A 350 m de ti', available: true },
    { name: 'Juan Paredes', distance: 'A 450 m de ti', available: true },
    { name: 'Andrea Quispe', distance: 'A 600 m de ti', available: true },
    { name: 'Diego Rivas', distance: 'A 820 m de ti', available: false },
  ];

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const userLocation: L.LatLngExpression = [-12.0464, -77.0428];

    this.map = L.map('risk-map').setView(userLocation, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    L.marker(userLocation).addTo(this.map).bindPopup('Tu ubicación actual').openPopup();

    L.circle([-12.045, -77.045], {
      radius: 250,
      color: '#ff4055',
      fillColor: '#ff4055',
      fillOpacity: 0.25,
    }).addTo(this.map);

    L.circle([-12.043, -77.04], {
      radius: 220,
      color: '#ffbd2e',
      fillColor: '#ffbd2e',
      fillOpacity: 0.25,
    }).addTo(this.map);

    L.circle([-12.049, -77.039], {
      radius: 200,
      color: '#00c875',
      fillColor: '#00c875',
      fillOpacity: 0.25,
    }).addTo(this.map);
  }

  errorMessage = '';

  sendSupportRequest(): void {
    const availableUsers = this.nearbyUsers.filter((user) => user.available);

    if (availableUsers.length === 0) {
      this.errorMessage = 'No hay usuarios disponibles cerca de tu ubicación.';

      this.supportSent = false;

      return;
    }

    this.errorMessage = '';
    this.supportSent = true;
  }

  cancelRequest(): void {
    this.supportSent = false;
  }
}
