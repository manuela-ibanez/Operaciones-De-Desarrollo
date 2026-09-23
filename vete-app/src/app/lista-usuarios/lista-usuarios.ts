import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../interfaces/usuario';
import { UsuariosService } from '../services/usuarios';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true, //Se puede usar directamente en una ruta, sin declararlo en un módulo
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css',
})
export class ListaUsuarios implements OnInit { // Implementar OnInit para inicialización
  usuarios: Usuario[] = []; //Lista de usuarios que le pasa el service desde el backend

  // Datos del usuario para lo formularios de crear y editar
  nombre: string = ''; 
  apellido: string = '';
  email: string = '';

  // Datos de la mascota para el formulario de crear usuario con mascota
  mascotaNombre: string = '';
  mascotaClase: string = '';
  mascotaPeso: number | undefined;
  mascotaEdad: number | undefined;
  editarUsuarioId: any | undefined; //Control para saber que usuario esta en edición

  constructor(private usuariosService: UsuariosService) {} // Inyectar el servicio de usuarios

  ngOnInit(): void { // Cargar datos iniciales desde el backend, a traves de ls services 
    this.loadUsuarios();
  }

  private loadUsuarios(): void { //Cuando el componente se inicie, llamar a loadUsuarios() para traer los usuarios del backend.
    this.usuariosService.getAll().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => console.error('Error al cargar los usuarios:', error)
    );
  }

  createUsuario(form: any): void { //Para formulario
    // Crear el objeto con usuario y mascota
    const nuevoUsuarioConMascota = { //Objeto que se envia al backend
      nombre: form.value.nombre, //Datos actuales
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

    // Llamar al servicio para crear usuario con mascota
    this.usuariosService.createUsuario(nuevoUsuarioConMascota).subscribe( //cuando el usuario aprieta el boton crear
      (addedUsuario) => { //Exito
        console.log('Usuario con mascota añadido', addedUsuario);
        alert('✅ Usuario y mascota creados exitosamente');
        
        // Limpiar formulario
        form.reset();
        this.loadUsuarios();
      },
      (error) => { //Error
        console.error('Error al agregar el usuario:', error);
        alert('❌ Error al crear el usuario. Por favor, intenta nuevamente.');
      }
    );
  }

  editUsuario (id:number): void{ //Abre y cierra el formulario
    if (this.editarUsuarioId === id){
      this.editarUsuarioId = null; //Si se vuelve a hacer click se cancela la edicion
      return;
    }
    this.editarUsuarioId = id;
    console.log('Usuario editado con id:', id);
  }

  updateUsuario (form: any): void {
    this.usuariosService.updateUsuario(form.value.id, { //Con el form.value obtiene los datos del usuario con el id
      nombre: form.value.nombre, //Hace put al backend enviando los nuevos datos para actualizar
      apellido:form.value.apellido,
      email:form.value.email,
    }).subscribe(
      (updateUsuario) => {
        const index = this.usuarios.findIndex(usuario => usuario.id === updateUsuario.id); //Busca en los usuarios el que tenga ese id y lo actualiza
        if (index !== -1){
          this.usuarios[index] = updateUsuario;
        }
        console.log ('Usuario actualizado:', updateUsuario);
        alert('✅ Usuario actualizado exitosamente');
        this.editarUsuarioId = null; //Desactiva el formulario de edición en la tabla
      },
    (error) => {
      console.log ('Ocurrio un error al actualizar el usuario', error);
      alert('❌ Error al actualizar el usuario')
    }
  );
}

 //Eliminar usuario
  deleteUsuario(id: number): void { //Se ejecuta al tocal el boton eliminar. Solo recibe el ID del usuario.
    alert ('¿Estás seguro de eliminar este usuario?');
      this.usuariosService.deleteUsuario(id).subscribe( //Llama al servicio para eliminar, delete(id) hace un delete al backend para eliminar
        () => {
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== id); //Actualiza la lista de usuarios
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