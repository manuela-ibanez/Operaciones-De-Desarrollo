import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpException, Put} from '@nestjs/common';
import { MascotasService } from './mascotas.service';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

@Controller('mascotas')
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Post()
  async create(@Body() createMascotaDto: CreateMascotaDto) {
    try {
      const mascota = await this.mascotasService.create(createMascotaDto);
      return mascota;  //Devolver solo la mascota, sin el mensaje
    } catch (error) {
      throw new HttpException('Error al crear la mascota', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.mascotasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const mascota = await this.mascotasService.findOne(+id);
    if (!mascota) {
      throw new HttpException('Mascota no encontrada', HttpStatus.NOT_FOUND);
    }
    return mascota;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMascotaDto: UpdateMascotaDto) {
    try {
      const mascota = await this.mascotasService.findOne(+id);
      if (!mascota) {
        throw new HttpException('Mascota no encontrada', HttpStatus.NOT_FOUND);
      }
      
      const updatedMascota = await this.mascotasService.update(+id, updateMascotaDto);
      return updatedMascota;  //Devolver solo la mascota actualizada, sin el mensaje
    } catch (error) {
      console.error('Error al actualizar la mascota:', error);
      throw new HttpException('Error al actualizar la mascota', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const mascota = await this.mascotasService.findOne(+id);
    if (!mascota) {
      throw new HttpException('Mascota no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.mascotasService.remove(+id);
    return { mensaje: 'Mascota eliminada correctamente' };
  }
}