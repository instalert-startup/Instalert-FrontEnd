import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { ReporteService } from '../../../../shared/services/reporte.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './report-views.html',
  styleUrls: ['./report-views.css'],
})
export class ReportesComponent implements OnInit, AfterViewInit {
  radioValue: number = 5.0;
  private map: any;
  incidentes: any[] = [];

  constructor(
    private reporteService: ReporteService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
    this.cargarDatos();
  }

  private initMap() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map-radar', {
      center: [-12.1222, -77.0298],
      zoom: 15,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 400);
  }

  cargarDatos() {
    this.reporteService.getReportes().subscribe({
      next: (data) => {
        const idsVistos = new Set();
        const listaProcesada: any[] = [];

        data.forEach((inc: any) => {
          // Filtro estricto por ID
          if (!idsVistos.has(inc.id)) {
            idsVistos.add(inc.id);

            const lat = inc.coords ? inc.coords[0] : inc.coordinates?.lat || -12.1222;
            const lng = inc.coords ? inc.coords[1] : inc.coordinates?.lng || -77.0298;

            listaProcesada.push({
              ...inc,
              tipo: inc.tipo || inc.type || 'Incidente',
              direccion: inc.direccion || inc.address || 'Ubicación desconocida',
              tiempo: inc.tiempo || inc.timeReported || 'Ahora',
              statusText: inc.statusText || inc.status || 'ACTIVO',
              estado: this.mapearEstadoCSS(inc.severity || inc.estado),
              hexColor: this.obtenerHexColor(inc.severity || inc.estado),
              coords: [lat, lng],
              // Solo se pueden eliminar los que NO sean los 4 originales
              esEliminable: inc.id > 104,
            });
          }
        });

        // REEMPLAZO: Vaciamos y llenamos en un solo paso
        this.incidentes = [...listaProcesada];

        this.addMarkers();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar:', err),
    });
  }

  private mapearEstadoCSS(valor: string): string {
    const mapa: any = {
      critical: 'red',
      red: 'red',
      warning: 'orange',
      orange: 'orange',
      resolved: 'green',
    };
    return mapa[valor] || 'red';
  }

  private obtenerHexColor(valor: string): string {
    const mapa: any = {
      critical: '#ff3333',
      red: '#ff3333',
      warning: '#ffaa00',
      orange: '#ffaa00',
      resolved: '#00ff88',
      green: '#00ff88',
    };
    return mapa[valor] || '#ff3333';
  }

  private addMarkers() {
    if (!this.map) return;

    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.CircleMarker) this.map.removeLayer(layer);
    });

    // 1. TU POSICIÓN
    const miPosicion: [number, number] = [-12.1222, -77.0298];
    L.circleMarker(miPosicion, {
      radius: 9,
      fillColor: '#00f2ff',
      color: '#ffffff',
      weight: 3,
      fillOpacity: 1,
    })
      .addTo(this.map)
      .bindPopup('<b>Tú</b>');

    // 2. INCIDENTES
    this.incidentes.forEach((inc) => {
      L.circleMarker([inc.coords[0], inc.coords[1]], {
        radius: 7,
        fillColor: inc.hexColor,
        color: '#ffffff',
        weight: 2,
        fillOpacity: 1,
      })
        .addTo(this.map)
        .bindPopup(`<b>${inc.tipo}</b>`);
    });

    this.map.panTo(miPosicion);
  }

  // Agrega este método a tu clase ReportesComponent
  eliminarIncidente(id: any) {
    if (confirm('¿Deseas eliminar este reporte personal?')) {
      this.reporteService.eliminarReporte(id).subscribe({
        next: () => {
          this.incidentes = this.incidentes.filter((inc) => inc.id !== id);
          this.addMarkers();
          this.cdr.detectChanges();
        },
      });
    }
  }

  onRadioChange(event: any) {
    this.radioValue = parseFloat((event.target as HTMLInputElement).value);
  }
}


