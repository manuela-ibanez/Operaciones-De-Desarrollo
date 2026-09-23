import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true, //Se puede usar directamente en una ruta, sin declararlo en un módulo.
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  year = new Date().getFullYear(); // Obtener el año actual.
} 