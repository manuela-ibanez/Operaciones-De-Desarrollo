import { CommonModule, NgIf } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MascotasService } from '../services/mascotas';
import { Mascota } from "../interfaces/mascota";
import { UsuariosService } from "../services/usuarios";

@Component({
  selector: 'app-lista',
  standalone: true, //Se puede usar directamente en una ruta, sin declararlo en un módulo.
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './lista.html',
  styleUrls: ['./lista.css'],
})


export class Lista implements OnInit {
  protected mascotas: Mascota[] = []; //Array de objetos del tipo mascota (Interface)

// Datos del formulario para nueva mascota
  protected nombre: string | undefined;  //Cuando se cambian en el html se actualizan en el ts
  protected clase: string | undefined; //Para el formulario de crear mascotas a traves de ngModel
  protected peso: number | undefined;
  protected edad: number | undefined;
  protected usuarios: any; //Almacena la lista de usuarios que vienen del backend
  protected usuarioId: number | undefined; //Almacena el id del usuario seleccionado
  protected editarMascotaId: any | undefined; //Para saber que mascota esta en edición


  constructor( // Inyectar el servicio de mascotas y usuarios
    private mascotasService: MascotasService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void { // Cargar datos iniciales cuando se inicializa el componente.
    this.loadMascotas();
    this.loadUsuarios();
  }

  private loadMascotas(): void { // Componente que carga las mascotas desde el servicio, el componente se suscribe al servicio para recibir los datos del backend
    this.mascotasService.getAll().subscribe(
      (data) => { //Data es los datos que se reciben del backend
        this.mascotas = data; //Guarda los datos recibidos del service en el arreglo mascotas
      },
      (error) => {
        console.error('Error al cargar las mascotas:', error)
      }
    );
  }

  private loadUsuarios(): void { // Componente que carga los usuarios desde el servicio
    this.usuariosService.getAll().subscribe(
      (data) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error)
      }
    );
  }

  createMascota(form: any): void { //Se ejecuta al enviar un formulario.
    const newMascota: any = { //Objeto que se envia al backend
      nombre: form.value.nombre, //Form.value contiene los valores actuales
      clase: form.value.clase,
      peso: form.value.peso,
      edad: form.value.edad,
      usuarioId: form.value.usuarioId,
    }

    // Llamar al servicio para crear la mascota
    this.mascotasService.createMascota(newMascota).subscribe( //El serivce realiza un POST al backend creando una nueva mascota
      (addedMascota) => { //Exito
        this.mascotas.push(addedMascota); //Respuesta del backend
        console.log('Mascota añadida', addedMascota);
        alert('✅ Mascota creada exitosamente');
        
        // Limpiar formulario
        form.reset();
        
        // Recargar lista completa desde el backend
        this.loadMascotas();
      },
      (error) => { //Error
        console.error('Error al agregar la mascota:', error);
        alert('❌ Error al crear la mascota');
      }
    );
  }

  editMascota (id:number): void{ //Abre y cierra el formulario
    if (this.editarMascotaId === id){ //Comprueba si el formulario esta abierto
      this.editarMascotaId = null; //Si se vuelve a hacer click se cancela la edicion
      return;
    }
    this.editarMascotaId = id;
    console.log('Mascota editada con id:', id);
  }

  updateMascota (form: any): void {
    this.mascotasService.updateMascota(form.value.id, { //Con el form.value obtiene los datos de la mascota con el id
      nombre: form.value.nombre, //Hace put al backend enviando los nuevos datos para actualizar
      clase:form.value.clase,
      peso:form.value.peso,
      edad:form.value.edad,
    }).subscribe(
      (updateMascota) => { 
        const index = this.mascotas.findIndex(mascota => mascota.id === updateMascota.id); //Busca en las mascotas la que tenga ese id y la actualiza
        if (index !== -1){
          this.mascotas[index] = updateMascota;
        }
        console.log ('Mascota actualizada:', updateMascota);
        alert('✅ Mascota actualizada exitosamente');
        this.editarMascotaId = null; //Desactiva el formulario de edición en la tabla
      },
    (error) => {
      console.log ('Ocurrio un error al actualizar la mascota', error);
      alert('❌ Error al actualizar la mascota');
    }
  );
}

  //Elimina la mascota
  deleteMascota(id: number): void { //Se ejecuta al tocal el boton eliminar. Solo recibe el ID de la mascota.
    alert ('¿Estás seguro de eliminar esta mascota?');
      this.mascotasService.deleteMascota(id).subscribe( //Llama al servicio para eliminar, delete(id) hace un delete al backend para eliminar
        () => {
          this.mascotas = this.mascotas.filter(mascota => mascota.id !== id); //Actualiza la lista de mascotas
          alert('✅ Mascota eliminada exitosamente');
          console.log(`Mascota con ID ${id} eliminada`);
        },
        (error) => {
          console.error('Error al eliminar la mascota:', error);
          alert('❌ Error al eliminar la mascota');
        }
      );
    }
  }