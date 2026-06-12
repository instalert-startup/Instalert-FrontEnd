import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private incidentsUrl = 'http://localhost:3000/incidents';
  private riskZonesUrl = 'http://localhost:3000/risk-zones';

  constructor(private http: HttpClient) {}

  getReportes(): Observable<any[]> {
    return this.http.get<any[]>(this.incidentsUrl);
  }

  getRiskZones(): Observable<any[]> {
    return this.http.get<any[]>(this.riskZonesUrl);
  }

  crearReporte(reporte: any): Observable<any> {
    return this.http.post<any>(this.incidentsUrl, reporte);
  }

  eliminarReporte(id: string | number) {
    return this.http.delete(`${this.incidentsUrl}/${id}`);
  }
}
