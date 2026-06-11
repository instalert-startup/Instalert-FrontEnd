import { Injectable } from '@angular/core';
import { ILocationProvider } from '../../domain/ports/location-provider.interface';
import { Geolocation } from '../../domain/value-objects/geolocation.value-object';

@Injectable({
  providedIn: 'root',
})
export class BrowserGeolocationAdapter implements ILocationProvider {
  /**
   * Implementación del puerto utilizando la API nativa de Geolocalización de HTML5.
   */
  public getCurrentLocation(): Promise<Geolocation> {
    return new Promise((resolve, reject) => {

      if (!navigator.geolocation) {
        reject(new Error('La geolocalización no está soportada por este navegador.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          try {
            const { latitude, longitude, accuracy } = position.coords;
            const domainGeolocation = Geolocation.create(latitude, longitude, accuracy);

            resolve(domainGeolocation);
          } catch (domainError) {
            reject(domainError);
          }
        },
        (error) => {

          let errorMessage = 'Error al obtener la ubicación geográfica.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'El usuario denegó el acceso a la geolocalización en el navegador.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'La información de la ubicación no está disponible actualmente.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Se agotó el tiempo de espera para capturar el GPS.';
              break;
          }

          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    });
  }
}
