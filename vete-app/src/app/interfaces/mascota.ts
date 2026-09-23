import { Usuario } from "./usuario";

export interface Mascota {
    id?: number;
    nombre: string;
    clase: string;
    peso: number;
    edad: number;
    usuarioId: number;   // se envia al backend al crear/editar
    usuario: Usuario;    // se recibe del backend al listar
}
