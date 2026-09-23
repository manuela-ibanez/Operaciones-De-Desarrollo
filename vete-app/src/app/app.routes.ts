import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Lista } from './lista/lista';
import { ListaUsuarios } from './lista-usuarios/lista-usuarios';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, //La home donde inicia la paginas
  { path: 'home', component: Home }, // Ruta a home
  { path: 'mascotas', component: Lista }, // Ruta a listas de mascotas
  { path: 'usuarios', component: ListaUsuarios }, // Ruta a listas de usuarios
  { path: '**', redirectTo: '/home' } //Para manejar errores de navegación
];