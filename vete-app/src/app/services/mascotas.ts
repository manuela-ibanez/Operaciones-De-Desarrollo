//El service se encarga de persistir los datos, trae los datos del backend.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from '../interfaces/mascota';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MascotasService {
  private baseUrl = `${environment.apiUrl}/mascotas`;
    constructor(private http: HttpClient) { //Se inyecta un cliente http, permite hacer get, post, put, delete con las URL
    }
  // Traer todas las mascotas. Mascorta es la interfaz
    getAll(): Observable<Mascota[]> { //Cuando cambia el observable toma una acción
    return this.http.get<Mascota[]>(this.baseUrl); //El metodo get devuelve un observable
    }

  // Mostrar mascota por su ID.
    getMascota(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.baseUrl}/${id}`);
    }

  // Crear una mascota.
    createMascota(mascota: any): Observable<Mascota> {
    return this.http.post<Mascota>(this.baseUrl, mascota);
    }

  // Actualizar una mascota.
    updateMascota(id: number, mascota: any): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.baseUrl}/${id}`, mascota);
    }

  // Eliminar una mascota.
    deleteMascota(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
    }
}