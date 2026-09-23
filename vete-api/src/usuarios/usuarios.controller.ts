import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpException, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) { //Async hace que el metodo sea asincronico.
    try {
      const usuario = await this.usuariosService.create(createUsuarioDto); //Llama al serivice para crear el usuario.
      return { mensaje: 'Usuario creado correctamente', usuario }; // Devuelve un mensaje y el usuario creado.
    } catch (error) {
      throw new HttpException('Error al crear el usuario', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() { 
    return this.usuariosService.findAll(); //Llama al service para obtener todos los usuarios.
  }

  @Get(':id')
  async findOne(@Param('id') id: string) { //Extrae el parametro ID de la URL.
      const usuario = await this.usuariosService.findOne(+id); //Llama al service para obtener un usuario por su ID.
      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      return usuario;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) { //Actualiza un usuario por su ID.
    try {
      const usuario = await this.usuariosService.findOne(+id); //Verifica si el usuario existe antes de actualizarlo.
      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      const updatedUsuario = await this.usuariosService.update(+id, updateUsuarioDto); //Consulta al service para devolver los datos actualizados.
      return { mensaje: 'Usuario actualizado correctamente', usuario: updatedUsuario };
    } catch (error) {
      throw new HttpException('Error al actualizar el usuario', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) { //Elimina un usuario por su ID.
      const usuario = await this.usuariosService.findOne(+id); //Verifica si el usuario existe antes de eliminarlo.
      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      await this.usuariosService.remove(+id); //Llama al service para eliminar el usuario.
      return { mensaje: 'Usuario eliminado correctamente' };
  }
}
