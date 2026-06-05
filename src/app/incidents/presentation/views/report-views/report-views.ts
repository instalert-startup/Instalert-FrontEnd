import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ReporteService } from '../../../../shared/services/reporte.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './report-views.html',
  styleUrls: ['./report-views.css'],
})
export class ReportesComponent implements OnInit, AfterViewInit {
  radioValue: number = 5.0;
  selectedRiskLevel: string = 'all';

  private map: any;

  incidentes: any[] = [];
  incidentesFiltrados: any[] = [];
  riskZones: any[] = [];

  get highRiskZonesCount(): number {
    return this.riskZones.filter((zone) => zone.level === 'high').length;
  }

  get mediumRiskZonesCount(): number {
    return this.riskZones.filter((zone) => zone.level === 'medium').length;
  }

  get lowRiskZonesCount(): number {
    return this.riskZones.filter((zone) => zone.level === 'low').length;
  }

  get totalRiskZoneIncidents(): number {
    return this.riskZones.reduce((total, zone) => total + (zone.incidentCount || 0), 0);
  }

  constructor(
    private reporteService: ReporteService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
    this.cargarDatos();
    this.cargarZonasRiesgo();
  }

  private initMap() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map-radar', {
      center: [-12.1222, -77.0298],
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

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
              nivelRiesgo: this.mapearNivelRiesgo(inc.severity || inc.estado),
              hexColor: this.obtenerHexColor(inc.severity || inc.estado),
              coords: [lat, lng],
              esEliminable: inc.id > 104,
            });
          }
        });

        this.incidentes = [...listaProcesada];
        this.aplicarFiltroRiesgo();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar incidentes:', err),
    });
  }

  cargarZonasRiesgo() {
    this.reporteService.getRiskZones().subscribe({
      next: (data) => {
        this.riskZones = data.map((zone: any) => ({
          ...zone,
          hexColor: this.obtenerColorZonaRiesgo(zone.level),
          radio: this.obtenerRadioZonaRiesgo(zone.level),
        }));

        this.addMarkers();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar zonas de riesgo:', err),
    });
  }

  cambiarFiltroRiesgo(level: string) {
    this.selectedRiskLevel = level;
    this.aplicarFiltroRiesgo();
  }

  private aplicarFiltroRiesgo() {
    if (this.selectedRiskLevel === 'all') {
      this.incidentesFiltrados = [...this.incidentes];
    } else {
      this.incidentesFiltrados = this.incidentes.filter(
        (inc) => inc.nivelRiesgo === this.selectedRiskLevel,
      );
    }

    this.addMarkers();
  }

  private mapearNivelRiesgo(valor: string): string {
    const mapa: any = {
      critical: 'high',
      red: 'high',
      warning: 'medium',
      orange: 'medium',
      resolved: 'low',
      info: 'low',
      closed: 'low',
      green: 'low',
    };

    return mapa[valor] || 'high';
  }

  private mapearEstadoCSS(valor: string): string {
    const mapa: any = {
      critical: 'red',
      red: 'red',
      warning: 'orange',
      orange: 'orange',
      resolved: 'green',
      info: 'green',
      closed: 'green',
      green: 'green',
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
      info: '#00ff88',
      closed: '#00ff88',
      green: '#00ff88',
    };

    return mapa[valor] || '#ff3333';
  }

  private obtenerColorZonaRiesgo(level: string): string {
    const mapa: any = {
      high: '#ff3333',
      medium: '#ffaa00',
      low: '#00ff88',
    };

    return mapa[level] || '#ff3333';
  }

  private obtenerRadioZonaRiesgo(level: string): number {
    const mapa: any = {
      high: 1400,
      medium: 1000,
      low: 700,
    };

    return mapa[level] || 700;
  }

  private addMarkers() {
    if (!this.map) return;

    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.CircleMarker || layer instanceof L.Circle) {
        this.map.removeLayer(layer);
      }
    });

    // 1. ZONAS DE RIESGO / HEATMAP
    this.riskZones.forEach((zone) => {
      L.circle([zone.coordinates.lat, zone.coordinates.lng], {
        radius: zone.radio,
        fillColor: zone.hexColor,
        color: zone.hexColor,
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.10,
      })
        .addTo(this.map)
        .bindPopup(`<b>${zone.name}</b><br>${zone.incidentCount} incidentes`);
    });

    // 2. TU POSICIÓN
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

    // 3. INCIDENTES
    this.incidentesFiltrados.forEach((inc) => {
      L.circleMarker([inc.coords[0], inc.coords[1]], {
        radius: 7,
        fillColor: inc.hexColor,
        color: '#ffffff',
        weight: 2,
        fillOpacity: 1,
      })
        .addTo(this.map)
        .bindPopup(`<b>${inc.tipo}</b><br>${inc.statusText}`);
    });

    this.map.panTo(miPosicion);
  }

  eliminarIncidente(id: any) {
    if (confirm('¿Deseas eliminar este reporte personal?')) {
      this.reporteService.eliminarReporte(id).subscribe({
        next: () => {
          this.incidentes = this.incidentes.filter((inc) => inc.id !== id);
          this.aplicarFiltroRiesgo();
          this.cdr.detectChanges();
        },
      });
    }
  }

  onRadioChange(event: any) {
    this.radioValue = parseFloat((event.target as HTMLInputElement).value);
  }

  irACrearReporte() {
    this.router.navigate(['/app/crear-reporte']);
  }
}
