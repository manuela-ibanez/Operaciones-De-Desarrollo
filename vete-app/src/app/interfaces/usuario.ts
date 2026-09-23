import { Mascota } from "./mascota";

export interface Usuario {
    id?: number;
    nombre: string;
    email: string;
    apellido: string;
    mascotas: Mascota[];
}