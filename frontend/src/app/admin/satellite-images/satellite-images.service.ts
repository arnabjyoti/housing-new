import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SatelliteImagesService {
  constructor(private http: HttpClient) {}

  locations() { return this.http.get<any[]>(`${environment.BASE_URL}/api/getLocation`); }
  sectors(locationId: string) { return this.http.get<any[]>(`${environment.BASE_URL}/api/getSectorData/${locationId}`); }
  list(userId: number) { return this.http.get<any[]>(`${environment.BASE_URL}/api/satellite-images`, { params: { userId } }); }
  save(data: FormData) { return this.http.post<any>(`${environment.BASE_URL}/api/satellite-images`, data); }
  remove(recordId: number, userId: number) { return this.http.delete<any>(`${environment.BASE_URL}/api/satellite-images/${recordId}`, { body: { userId } }); }
}
