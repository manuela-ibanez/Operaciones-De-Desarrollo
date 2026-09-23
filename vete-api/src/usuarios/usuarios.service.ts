import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Mascota } from '../mascotas/entities/mascota.entity';  // ← IMPORTAR
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Mascota)
    private mascotasRepository: Repository<Mascota>
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      // Crear el usuario
      const usuario = this.usuarioRepository.create({
        nombre: createUsuarioDto.nombre,
        email: createUsuarioDto.email,
        apellido: createUsuarioDto.apellido,
      });
      
      const usuarioGuardado = await this.usuarioRepository.save(usuario);

      // Si vienen mascotas, crearlas
      if (createUsuarioDto.mascotas && createUsuarioDto.mascotas.length > 0) {
        const mascotas = createUsuarioDto.mascotas.map((m: any) =>
          this.mascotasRepository.create({
            nombre: m.nombre,
            clase: m.clase,
            peso: m.peso,
            edad: m.edad,
            usuarioId: usuarioGuardado.id,
          }),
        );

        await this.mascotasRepository.save(mascotas);
      }

      // Devolver el usuario con sus mascotas
      return this.usuarioRepository.findOne({
        where: { id: usuarioGuardado.id },
        relations: ['mascotas'],
      });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw new HttpException('No se pudo crear el usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    return await this.usuarioRepository.find({ relations: ['mascotas'] });
  }

  findOne(id: number) {
    return this.usuarioRepository.findOne({
      where: { id },
      relations: ['mascotas'] 
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.usuarioRepository.update(id, updateUsuarioDto);
    const updatedUsuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['mascotas'] 
    });
    if (!updatedUsuario) {
      throw new Error(`Usuario with id ${id} not found after update.`);
    }
    return updatedUsuario;
  }

  remove(id: number) {
    return this.usuarioRepository.delete(id);
  }
}