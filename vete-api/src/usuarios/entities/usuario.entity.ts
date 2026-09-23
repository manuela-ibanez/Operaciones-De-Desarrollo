import { Mascota } from "src/mascotas/entities/mascota.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @Column()
    email: string;
    @Column()
    apellido: string;
    @OneToMany(() => Mascota, (mascota) => mascota.usuario)
    mascotas: Mascota[];
}
