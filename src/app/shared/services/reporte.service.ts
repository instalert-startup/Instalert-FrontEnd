import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  // Esta es la dirección donde corre tu json-server
  private apiUrl = 'http://localhost:3001/incidents';

  constructor(private http: HttpClient) {}

  // Obtener la lista de incidentes para el mapa y la lista
  getReportes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Guardar un nuevo incidente desde el formulario
  crearReporte(reporte: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reporte);
  }

  eliminarReporte(id: string | number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
