
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../interfaces/usuario';
import { UsuariosService } from '../services/usuarios';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true, // Se puede usar directamente en una ruta, sin declararlo en un módulo
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css',
})
export class ListaUsuarios implements OnInit {

  // Lista de usuarios que trae el servicio desde el backend
  usuarios: Usuario[] = [];

  // Datos del usuario para los formularios de crear y editar
  nombre = '';
  apellido = '';
  email = '';

  // Datos de la mascota para crear un usuario con mascota
  mascotaNombre = '';
  mascotaClase = '';
  mascotaPeso: number | undefined;
  mascotaEdad: number | undefined;

  // ID del usuario que se está editando
  editarUsuarioId: number | null = null;

  // Inyección del servicio de usuarios
  private usuariosService = inject(UsuariosService);

  // Cargar los usuarios al iniciar el componente
  ngOnInit(): void {
    this.loadUsuarios();
  }

  // Traer todos los usuarios del backend
  private loadUsuarios(): void {
    this.usuariosService.getAll().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }

  // Crear un usuario con una mascota
  createUsuario(form: NgForm): void {

    // Objeto que se envía al backend
    const nuevoUsuarioConMascota = {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      email: form.value.email,
      mascotas: [
        {
          nombre: form.value.mascotaNombre,
          clase: form.value.mascotaClase,
          peso: form.value.mascotaPeso,
          edad: form.value.mascotaEdad
        }
      ]
    };

    // Llamar al servicio para crear el usuario
    this.usuariosService.createUsuario(nuevoUsuarioConMascota).subscribe(
      (addedUsuario) => {
        console.log('Usuario con mascota añadido', addedUsuario);
        alert('✅ Usuario y mascota creados exitosamente');

        // Limpiar el formulario
        form.reset();
        this.loadUsuarios();
      },
      (error) => {
        console.error('Error al agregar el usuario:', error);
        alert('❌ Error al crear el usuario. Por favor, intenta nuevamente.');
      }
    );
  }

  // Abrir o cerrar el formulario de edición
  editUsuario(id: number): void {

    // Si el usuario ya está en edición, cancelar
    if (this.editarUsuarioId === id) {
      this.editarUsuarioId = null;
      return;
    }

    // Activar la edición de este usuario
    this.editarUsuarioId = id;
    console.log('Usuario editado con id:', id);
  }

  // Actualizar los datos de un usuario
  updateUsuario(form: NgForm): void {

    this.usuariosService.updateUsuario(form.value.id, {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      email: form.value.email
    }).subscribe(
      (updatedUsuario) => {

        // Buscar el usuario actualizado en la lista
        const index = this.usuarios.findIndex(
          usuario => usuario.id === updatedUsuario.id
        );

        // Reemplazar los datos anteriores por los nuevos
        if (index !== -1) {
          this.usuarios[index] = updatedUsuario;
        }

        console.log('Usuario actualizado:', updatedUsuario);
        alert('✅ Usuario actualizado exitosamente');

        // Cerrar el formulario de edición
        this.editarUsuarioId = null;
      },
      (error) => {
        console.error('Ocurrió un error al actualizar el usuario:', error);
        alert('❌ Error al actualizar el usuario');
      }
    );
  }

  // Eliminar un usuario
  deleteUsuario(id: number): void {

    alert('¿Estás seguro de eliminar este usuario?');

    this.usuariosService.deleteUsuario(id).subscribe(
      () => {

        // Quitar el usuario eliminado de la lista
        this.usuarios = this.usuarios.filter(
          usuario => usuario.id !== id
        );

        alert('✅ Usuario eliminado exitosamente');
        console.log(`Usuario con ID ${id} eliminado`);
      },
      (error) => {
        console.error('Error al eliminar el usuario:', error);
        alert('❌ Error al eliminar el usuario');
      }
    );
  }
}