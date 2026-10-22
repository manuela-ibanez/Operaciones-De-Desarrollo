import { Test, TestingModule } from '@nestjs/testing';
import { MascotasService } from './mascotas.service';
import { Mascota } from './entities/mascota.entity'; //Se necesita porque el service usa Repository<Mascota>
import { CreateMascotaDto } from './dto/create-mascota.dto'; //Se necesita para construir los datos que se le van a enviar al create
import { getRepositoryToken } from '@nestjs/typeorm'; //Para que nest identifique el respository mediante un token, permite obtener el dentificador para que no se use el respositorio real
import {  beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

describe('MascotasService', () => {
  let service: MascotasService; //Guarda la instancia real de MascotasService

  const mockMascotasRepository = { //Version simulada del repositorio
    //Se mockean los metodos porque son del repositorio
    find: jest.fn(), //Crea una funcion falsa que Jest puede controlar y observar
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  //Se ejecuta antes de cada test
  beforeEach(async () => { //Se necesita porque MascotasService no puede construirse solo, necesita las dependencias
    const module: TestingModule = await Test.createTestingModule({ //Crea el modulo de testing
      providers: [MascotasService, {provide:getRepositoryToken(Mascota), 
                                    useValue:mockMascotasRepository},], //Le dice a nest cual es el que se quiere construir
    }).compile(); //Se arma el modulo

    //Si MascotasServuce pide el repositorio se le da el mockeado
    service = module.get<MascotasService>(MascotasService);
  });

  //Se ejecuta antes de cada test
  beforeEach(() => { //Para que cada test comience limpio
    jest.clearAllMocks();
  });

  //Test por defecto
  it('Debería crear correctamente el servicio', () => { //Verifica si nest pudo construir MascotaService
    expect(service).toBeDefined();
  });

  //Test findAll
  describe('findAll', () => { //describe organiza los tests
    it('Deberia devolver todos las mascotas correctamente', async () => {
      //Arrange
      //Se mockean los usuarios para que luego los pueda devolver
      const usuario1 = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juan@mail.com',
        mascotas: [],
      } as Usuario; //Tipo que se le asigna

      const usuario2 = {
        id: 2,
        nombre: 'Ana',
        apellido: 'Lopez',
        email: 'ana@mail.com',
        mascotas: [],
      } as Usuario; //Tipo que se le asigna
      
      const mockMascotas = [ //Prepara los datos del test, mascotas mockeadas para el test
        { id: 1,
          nombre: 'Luna',
          clase: 'Perro',
          peso: 12,
          edad: 4,
          usuarioId: 1,
        },
      { id: 2,
        nombre: 'Toby',
        clase: 'Gato',
        peso: 5,
        edad: 2,
        usuarioId: 2,
      },
      ] as Mascota[]; //Tipo que se le asigna

      //Cuando se ejecuta mockMascotasRepository.find() devuelve mockMascotas
      //mockResolvedValue devuelve una promise resuelta (tiene async)
      mockMascotasRepository.find.mockResolvedValue(mockMascotas); 

      //Act
      const result = await service.findAll(); //Se ejecuta el metodo real que se quiere probar

      //Assert
      expect(result).toEqual(mockMascotas); //Verifica el resultado
  });
});

//Test Create
  describe('create', () => {
    it('Debería crear una mascota correctamente', async () => {
      // Arrange
      const createMascotaDto: CreateMascotaDto = { //Simula lo que llega del controller
        //Datos simulados que llegan para crear una mascota
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
      } as CreateMascotaDto; //Le indica que trate el objeto como un CreateMascotaDto

      //Se mockea al usuario que representa el dueño de la mascota
      const usuario = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juan@gmail.com',
        mascotas: [],
      } as Usuario;

      //Se mockea que el respositorio convierte los datos recibidos en una entidad mascota.
      const mascotaCreada = {
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
      } as Mascota;

      //Se simula que la base de datos le asignó un id a la mascota
      const mascotaGuardada = {
        id: 1, //Se simula el id
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
      } as Mascota;

      //Se simula el findOne de la base de datos, se añaden los datos del usuario
      const mascotaCompleta = {
        id: 1,
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
        usuario: usuario,
      } as Mascota;

      //Cuando se llame a create devuelve la mascota creada
      mockMascotasRepository.create.mockReturnValue(mascotaCreada); //Usa return value porque no es async
      //Cuando se llame a save devuelve la mascota guardada
      mockMascotasRepository.save.mockResolvedValue(mascotaGuardada); //Usa resolved value porque devuelve una promised
      //Cuando se llame a findOne devuelve la mascota
      mockMascotasRepository.findOne.mockResolvedValue(mascotaCompleta); //Representa el resultado del findOne

      // Act
      const result = await service.create(createMascotaDto); //Se ejecuta el metodo real

      // Assert
      //Comprueba que se devolvió la mascota esperada
      expect(result).toEqual(mascotaCompleta); //Result es un valor devuelto por service.create() y se quiere vetificar si son equivalentes
    });
  });
});