import { Test, TestingModule } from '@nestjs/testing';
import { MascotasService } from './mascotas.service';
import { Mascota } from './entities/mascota.entity'; //Se necesita porque el service usa Repository<Mascota>
import { CreateMascotaDto } from './dto/create-mascota.dto'; //Se necesita para construir los datos que se le van a enviar al create
import { getRepositoryToken } from '@nestjs/typeorm'; //Para que nest identifique el respository mediante un token, permite obtener el dentificador para que no se use el respositorio real

describe('MascotasService', () => {
  let service: MascotasService;

  const mockMascotasRepository = { //Versiones simuladas del repository
    find: jest.fn(), //Crea una funcion falsa que Jest puede controlar y observar
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => { //Cuando se pide Repository<Mascota> se da mockMascotasRepository
    const module: TestingModule = await Test.createTestingModule({
      providers: [MascotasService, {provide:getRepositoryToken(Mascota), 
                                    useValue:mockMascotasRepository},],
    }).compile();

    service = module.get<MascotasService>(MascotasService);
  });

  beforeEach(() => { //Para que cada test comeince limpio
    jest.clearAllMocks();
  });

  it('should be defined', () => { //Verifica si nest pudo construir MascotaService
    expect(service).toBeDefined();
  });

  //Test findAll
  describe('findAll', () => { //describe organiza los tests
    it('should return all mascotas successfully', async () => {
      //Arrange
      const mockMascotas = [ //Prepara los datos del test, mascotas inventadas para el test
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
        ] as Mascota[];

      //Cuando se ejecuta mockMascotasRepository.find() devuelve mockMascotas
      mockMascotasRepository.find.mockResolvedValue(mockMascotas);

      //Act
      const result = await service.findAll(); //Se ejecuta el metodo real que se quiere probar

      //Assert
      expect(mockMascotasRepository.find).toHaveBeenCalledWith({ //Verifica que se uso el repository correctamente
        relations: ['usuario'], //Se verifica porque el codigo necesita recuperar el usuario relacionado
      });

      expect(result).toEqual(mockMascotas); //Verifica el resultado
  });
});

//Test Create
  describe('create', () => {
    it('should create a mascota successfully', async () => {
      // Arrange
      const createMascotaDto = { //
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
      } as CreateMascotaDto; //Le indica que trate el objeto como un CreateMascotaDto

      const mascotaCreada = {
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
      } as Mascota;

      const mascotaGuardada = {
        id: 1,
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
      } as Mascota;

      const mascotaCompleta = {
        id: 1,
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
      } as Mascota;

      mockMascotasRepository.create.mockReturnValue(mascotaCreada); //Usa return value porque no es async
      mockMascotasRepository.save.mockResolvedValue(mascotaGuardada); //Usa resolved value porque devuelve una promised
      mockMascotasRepository.findOne.mockResolvedValue(mascotaCompleta); //Representa el resultado del findOne

      // Act
      const result = await service.create(createMascotaDto); //Se ejecuta el metodo real

      // Assert
      //Comprueba que se hayan pasado correctamente el DTO a create
      expect(mockMascotasRepository.create).toHaveBeenCalledWith( //toHaveBeenCalledWith verifica como fue llamada la función
        createMascotaDto);

      //Comprueba que la entidad fue enviada a save
      expect(mockMascotasRepository.save).toHaveBeenCalledWith(
        mascotaCreada);

      //Comprueba que despues de guardar incluya la relacion usuario
      expect(mockMascotasRepository.findOne).toHaveBeenCalledWith({
        where: { id: mascotaGuardada.id },
        relations: ['usuario'],
      });

      //Comprueba que se devolvió la mascota esperada
      expect(result).toEqual(mascotaCompleta); //Result es un valor devuelto por service.create() y se quiere vetificar si son equivalentes
    });
  });
});