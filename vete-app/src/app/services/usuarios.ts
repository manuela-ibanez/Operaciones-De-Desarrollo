//El service se encarga de persistir los datos, trae los datos del backend.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  private baseUrl = `${environment.apiUrl}/usuarios`;
  constructor(private http: HttpClient) {}

  // Traer todos los usuarios.
  getAll(): Observable<Usuario[]> { //Cuando cambia el observable toma una acción
    return this.http.get<Usuario[]>(this.baseUrl); //El metodo get devuelve un observable
  }

  // Traer un usuario por una ID.
  getUsuarios(id: number): Observable<Usuario> { //Devuelve un observable
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  // Crear un usuario.
  createUsuario(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  // Actualizar un usuario con su ID.
  updateUsuario(id: number, usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario);
  }

  // eliminar un usuario.
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
