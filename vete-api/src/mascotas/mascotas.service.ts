import { Injectable } from '@nestjs/common';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from './entities/mascota.entity';

@Injectable()
export class MascotasService {
  constructor(
    @InjectRepository(Mascota)
    private mascotasRepository: Repository<Mascota>,
  ) {}
  
  async create(createMascotaDto: CreateMascotaDto) {
    const mascota = this.mascotasRepository.create(createMascotaDto);
    const mascotaGuardada = await this.mascotasRepository.save(mascota);
    
    // Recargar con la relación de usuario
    return this.mascotasRepository.findOne({
      where: { id: mascotaGuardada.id },
      relations: ['usuario']
    });
  }

  findAll(): Promise<Mascota[]> {
    return this.mascotasRepository.find({ relations: ['usuario'] });
  }

  findOne(id: number): Promise<Mascota | null> {
    return this.mascotasRepository.findOne({
      where: { id },
      relations: ['usuario']
    });
  }
  
  async update(id: number, updateMascotaDto: Partial<Mascota>): Promise<Mascota> {
    await this.mascotasRepository.update(id, updateMascotaDto);
    const updatedMascota = await this.mascotasRepository.findOne({
      where: { id },
      relations: ['usuario']
    });
    if (!updatedMascota) {
      throw new Error(`Mascota with id ${id} not found after update.`);
    }
    return updatedMascota;
  }

  async remove(id: number) {
    await this.mascotasRepository.delete(id);
  }
}