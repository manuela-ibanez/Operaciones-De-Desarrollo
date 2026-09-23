export class CreateUsuarioDto {
    nombre: string;
    email: string;
    apellido: string;
    mascotas?: Array<{ //Nest espera recibir un arreglo con los datos de la mascota, en vez de un arreglo vacio
        nombre: string;
        clase: string;
        peso: number;
        edad: number;
    }>;
}