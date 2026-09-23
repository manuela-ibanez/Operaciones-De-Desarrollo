import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Mascota {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    clase: string;

    @Column()
    peso: number;

    @Column()
    edad: number;

    @Column() 
    usuarioId: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.mascotas, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuarioId' }) //Ahora nest no espera recibir un usuario, sino un ID asociado a un usuario, que se lo envia angular.
    usuario: Usuario;
}