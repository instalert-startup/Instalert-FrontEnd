import { Component, inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PanicButtonStore } from '../../../../emergencies/application/state/panic-button.store';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardViewComponent implements AfterViewInit, OnDestroy {
  public store = inject(PanicButtonStore);

  riskLevel: 'safe' | 'warning' | 'danger' = 'warning';
  private map!: L.Map;

  connectedContacts = [
    { id: 1, name: 'Juan Pérez', distance: '0.8 km', risk: 'high', avatar: 'JP' },
    { id: 2, name: 'María López', distance: '1.5 km', risk: 'medium', avatar: 'ML' },
    { id: 3, name: 'Ricardo Díaz', distance: '3.2 km', risk: 'low', avatar: 'RD' },
  ];

  recentReports = [
    {
      id: 1,
      type: 'Actividad sospechosa',
      location: 'Av. Simón Bolívar 450',
      time: 'Hace 12 min',
      severity: 'medium',
    },
    {
      id: 2,
      type: 'Robo a transeúnte',
      location: 'Calle Tacna 120',
      time: 'Hace 45 min',
      severity: 'high',
    },
    {
      id: 3,
      type: 'Alumbrado público fallado',
      location: 'Parque de la Juventud',
      time: 'Hace 2 horas',
      severity: 'low',
    },
  ];

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  private initMap(): void {
    this.map = L.map('dashboard-map').setView([-12.0464, -77.0428], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.map.setView([lat, lng], 15);

        const userIcon = L.divIcon({
          className: '',
          html: `<div style="width:16px;height:16px;background:#2196F3;border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(0,0,0,0.5);"></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        L.marker([lat, lng], { icon: userIcon })
          .addTo(this.map)
          .bindPopup('<b>Tu ubicación</b>')
          .openPopup();
      });
    }
  }
}
