import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ReporteService } from '../../../../shared/services/reporte.service';
import { TranslateModule } from '@ngx-translate/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-crear-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './create-report.html',
  styleUrls: ['./create-report.css'],
})
export class CrearReporteComponent implements OnInit {
  // 1. Objeto inicial unificado para evitar errores de TypeScript
  nuevoReporte = {
    tipo: '',
    ubicacion: '',
    descripcion: '',
    lat: -12.1222,
    lng: -77.0298,
    fecha: '',
    estado: 'red',
    statusText: 'ACTIVA',
  };

  previewUrl: string | null = null;
  private map: any;

  constructor(
    private reporteService: ReporteService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.nuevoReporte.ubicacion = `Lat: ${this.nuevoReporte.lat.toFixed(4)}, Lng: ${this.nuevoReporte.lng.toFixed(4)}`;

    this.initMap();
  }

  private initMap() {
    this.map = L.map('map-form').setView([this.nuevoReporte.lat, this.nuevoReporte.lng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    const marker = L.marker([this.nuevoReporte.lat, this.nuevoReporte.lng], {
      draggable: true,
    }).addTo(this.map);

    // 2. Actualización de coordenadas al arrastrar el marcador
    marker.on('dragend', () => {
      const position = marker.getLatLng();

      // Actualizamos las variables individuales para que publicarReporte() las encuentre
      this.nuevoReporte.lat = position.lat;
      this.nuevoReporte.lng = position.lng;

      // Actualizamos el texto que se ve en el badge del mapa
      this.nuevoReporte.ubicacion = `Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`;
    });
  }

  cambiarUbicacion() {
    this.map.setView([-12.122, -77.028], 15);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // 3. Función de publicación corregida

  async publicarReporte() {
    if (!this.nuevoReporte.fecha) {
      this.nuevoReporte.fecha = new Date().toISOString();
    }

    const direccion = await this.obtenerDireccionDesdeCoordenadas(
      this.nuevoReporte.lat,
      this.nuevoReporte.lng,
    );

    this.nuevoReporte.ubicacion = direccion;

    const reporteFinal = {
      type: this.nuevoReporte.tipo,
      severity: 'critical',
      timeReported: 'Ahora',
      address: this.nuevoReporte.ubicacion,
      description: this.nuevoReporte.descripcion,
      status: 'ACTIVA',
      coordinates: {
        lat: this.nuevoReporte.lat,
        lng: this.nuevoReporte.lng,
      },
      fecha: this.nuevoReporte.fecha,
    };

    this.reporteService.crearReporte(reporteFinal).subscribe({
      next: () => {
        alert('¡Reporte creado con éxito!');
        this.router.navigate(['/app/reportes']);
      },
    });
  }

  private async obtenerDireccionDesdeCoordenadas(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );

      const data = await response.json();

      const address = data.address || {};

      const calle = address.road || address.pedestrian || address.footway || '';

      const numero = address.house_number || '';

      const distrito = address.suburb || address.neighbourhood || address.city_district || '';

      const direccionFormateada = [`${calle} ${numero}`.trim(), distrito]
        .filter(Boolean)
        .join(', ');

      return (
        direccionFormateada || data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
      );
    } catch (error) {
      console.error('Error al obtener dirección:', error);
      return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    }
  }
}
