import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true, //Se puede usar directamente en una ruta, sin declararlo en un módulo.
  imports: [RouterLink], // Importar RouterLink para la navegación.
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}