import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { environment } from '../../environments/environment';

// Datos que utilizamos para crear o actualizar usuarios
type DatosUsuario = Pick<Usuario, 'nombre' | 'apellido' | 'email'>;

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  private baseUrl = `${environment.apiUrl}/usuarios`;
  private http = inject(HttpClient);

  // Traer todos los usuarios
  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  // Traer un usuario por su ID
  getUsuarios(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  // Crear un usuario
  createUsuario(usuario: DatosUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  // Actualizar un usuario
  updateUsuario(id: number, usuario: Partial<DatosUsuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario);
  }

  // Eliminar un usuario
  deleteUsuario(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/${id}`);
  }
}
