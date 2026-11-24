
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from '../interfaces/mascota';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MascotasService {
  private baseUrl = `${environment.apiUrl}/mascotas`;
  private http = inject(HttpClient);

  // Traer todas las mascotas
  getAll(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.baseUrl);
  }

  // Mostrar mascota por su ID
  getMascota(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.baseUrl}/${id}`);
  }

  // Crear una mascota
  createMascota(mascota: Partial<Mascota>): Observable<Mascota> {
    return this.http.post<Mascota>(this.baseUrl, mascota);
  }

  // Actualizar una mascota
  updateMascota(id: number, mascota: Partial<Mascota>): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.baseUrl}/${id}`, mascota);
  }

  // Eliminar una mascota
  deleteMascota(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/${id}`);
  }
}