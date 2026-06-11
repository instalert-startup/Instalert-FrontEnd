export class Geolocation {

  private constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly accuracy?: number,
  ) {}

  public static create(latitude: number, longitude: number, accuracy?: number): Geolocation {
    // Reglas estrictas de negocio
    if (latitude < -90 || latitude > 90) {
      throw new Error(`Latitud inválida (${latitude}). Debe estar entre -90 y 90.`);
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error(`Longitud inválida (${longitude}). Debe estar entre -180 y 180.`);
    }

    return new Geolocation(latitude, longitude, accuracy);
  }

  public format(): string {
    return `Lat: ${this.latitude.toFixed(4)} | Lon: ${this.longitude.toFixed(4)}`;
  }
}
