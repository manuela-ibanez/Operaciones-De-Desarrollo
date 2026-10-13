// Importamos las herramientas de testing de Nest.
// Test sirve para crear un módulo de prueba y TestingModule representa ese módulo.
import { Test, TestingModule } from '@nestjs/testing';

// Importamos el service REAL que queremos probar.
// Lo que estamos testeando en este archivo es MascotasService.
import { MascotasService } from './mascotas.service';

// Importamos la entidad Mascota porque MascotasService utiliza
// un Repository<Mascota>.
import { Mascota } from './entities/mascota.entity';

// Importamos el DTO que define los datos necesarios para crear una mascota.
import { CreateMascotaDto } from './dto/create-mascota.dto';

// getRepositoryToken permite identificar dentro de Nest
// cuál es la dependencia Repository<Mascota>.
// Lo usamos para reemplazar el repository real por uno simulado.
import { getRepositoryToken } from '@nestjs/typeorm';

import { Usuario } from '../usuarios/entities/usuario.entity';


// describe agrupa todos los tests relacionados con MascotasService.
describe('MascotasService', () => {

  // Esta variable va a guardar la instancia REAL de MascotasService
  // que Nest crea para cada test.
  let service: MascotasService;


  // Creamos un repository falso o mock.
  //
  // El MascotasService real necesita un Repository<Mascota>,
  // pero en este unit test no queremos conectarnos a PostgreSQL.
  //
  // Por eso simulamos solamente los métodos del repository
  // que utiliza nuestro service.
  const mockMascotasRepository = {

    // jest.fn() crea una función simulada.
    // Después podemos decidir qué devuelve y verificar cómo fue llamada.
    find: jest.fn(),

    create: jest.fn(),

    save: jest.fn(),

    findOne: jest.fn(),
  };


  // beforeEach se ejecuta antes de CADA test.
  //
  // Acá preparamos el entorno necesario para crear MascotasService.
  beforeEach(async () => {

    // Creamos un módulo de testing de Nest.
    const module: TestingModule = await Test.createTestingModule({

      providers: [

        // Queremos utilizar el MascotasService real.
        MascotasService,

        {
          // MascotasService tiene algo similar a:
          //
          // @InjectRepository(Mascota)
          // private mascotasRepository: Repository<Mascota>
          //
          // getRepositoryToken(Mascota) identifica justamente
          // esa dependencia.
          provide: getRepositoryToken(Mascota),

          // En lugar de entregarle el repository real,
          // Nest le va a entregar nuestro repository simulado.
          useValue: mockMascotasRepository,
        },
      ],

    }).compile();

    // Obtenemos del módulo de testing la instancia
    // de MascotasService que vamos a probar.
    service = module.get<MascotasService>(MascotasService);
  });


  // Este beforeEach también se ejecuta antes de cada test.
  //
  // Limpiamos el historial de llamadas de todos los mocks
  // para que un test no afecte al siguiente.
  beforeEach(() => {
    jest.clearAllMocks();
  });


  // Este es el test básico que Nest suele generar.
  //
  // Comprueba que Nest haya podido construir correctamente
  // una instancia de MascotasService.
  it('Debería crear correctamente el servicio', () => {

    expect(service).toBeDefined();

  });


  // =========================================================
  // TEST DE findAll()
  // =========================================================

  // Este describe agrupa los tests relacionados con findAll().
  describe('findAll', () => {

    // Este caso de prueba comprueba que findAll()
    // devuelva correctamente todas las mascotas.
    it('Debería devolver todas las mascotas correctamente', async () => {


      // -------------------------
      // ARRANGE
      // -------------------------
      //
      // Arrange significa preparar todo lo necesario
      // antes de ejecutar el método que queremos probar.

      // Creamos mascotas falsas únicamente para este test.
      //
      // No vienen de PostgreSQL.
      // Nosotros controlamos estos datos.

      const usuario1 = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juan@mail.com',
        mascotas: [],
      } as Usuario;
      
      const usuario2 = {
        id: 2,
        nombre: 'Ana',
        apellido: 'Lopez',
        email: 'ana@mail.com',
        mascotas: [],
      } as Usuario;

      const mockMascotas = [
        {
          id: 1,
          nombre: 'Luna',
          clase: 'Perro',
          peso: 12,
          edad: 4,
          usuarioId: 1,
          usuario: usuario1,
        },

        {
          id: 2,
          nombre: 'Toby',
          clase: 'Gato',
          peso: 5,
          edad: 2,
          usuarioId: 2,
          usuario: usuario2,
        },

      ] as Mascota[];


      // Le indicamos al mock:
      //
      // "Cuando alguien llame a repository.find(),
      // devolvé estas dos mascotas".
      //
      // Usamos mockResolvedValue porque find()
      // devuelve una Promise.
      mockMascotasRepository.find.mockResolvedValue(mockMascotas);


      // -------------------------
      // ACT
      // -------------------------
      //
      // Act significa ejecutar el método REAL
      // que queremos comprobar.

      // Ejecutamos el findAll() real de MascotasService.
      //
      // Internamente ese método va a llamar a:
      //
      // this.mascotasRepository.find(...)
      //
      // pero mascotasRepository fue reemplazado
      // por nuestro mock.
      const result = await service.findAll();


      // -------------------------
      // ASSERT
      // -------------------------
      //
      // Assert significa verificar que ocurrió
      // lo que esperábamos.


      // Finalmente comprobamos que el resultado
      // devuelto por findAll() sea exactamente
      // el conjunto de mascotas que esperábamos.
      expect(result).toEqual(mockMascotas);

    });

  });


  // =========================================================
  // TEST DE create()
  // =========================================================

  // Agrupamos los tests correspondientes al método create().
  describe('create', () => {

    // Este caso comprueba que una mascota
    // pueda ser creada correctamente.
    it('Debería crear una mascota correctamente', async () => {


      // -------------------------
      // ARRANGE
      // -------------------------

      // Este objeto representa los datos que recibiría
      // MascotasService para crear una mascota.
      //
      // Es decir, simula lo que podría llegar desde el controller.
      const createMascotaDto = {
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
      } as CreateMascotaDto;


      // repository.create() todavía NO guarda nada
      // en la base de datos.
      //
      // Simplemente toma el DTO y crea una instancia
      // de la entidad Mascota.
      //
      // Por eso acá todavía no necesitamos un ID.
      const mascotaCreada = {
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
      } as Mascota;


      // Esta representa la mascota después de pasar
      // por repository.save().
      //
      // Como ya fue "guardada", simulamos que
      // PostgreSQL le asignó id = 1.
      const mascotaGuardada = {
        id: 1,
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
      } as Mascota;


      // El create() de nuestro service,
      // después de guardar la mascota,
      // hace un findOne() para volver a buscarla
      // incluyendo la relación usuario.
      //
      // Este objeto representa ese resultado final.
      const mascotaCompleta = {
        id: 1,
        nombre: 'Luna',
        clase: 'Perro',
        peso: 12,
        edad: 4,
        usuarioId: 1,
      } as Mascota;


      // Configuramos el comportamiento de los mocks.


      // repository.create() NO es async.
      //
      // Por eso usamos mockReturnValue.
      //
      // Cuando el service llame create(),
      // devolverá mascotaCreada.
      mockMascotasRepository.create.mockReturnValue(mascotaCreada);


      // repository.save() SÍ devuelve una Promise.
      //
      // Por eso usamos mockResolvedValue.
      //
      // Simulamos que después de guardar
      // obtenemos mascotaGuardada con id = 1.
      mockMascotasRepository.save.mockResolvedValue(mascotaGuardada);


      // findOne() también es async.
      //
      // Simulamos que al volver a buscar la mascota,
      // obtenemos mascotaCompleta.
      mockMascotasRepository.findOne.mockResolvedValue(mascotaCompleta);


      // -------------------------
      // ACT
      // -------------------------

      // Ejecutamos el método create() REAL
      // de MascotasService.
      const result = await service.create(createMascotaDto);


      // -------------------------
      // ASSERT
      // -------------------------

      // Verificamos que repository.create()
      // haya recibido exactamente el DTO
      // que nosotros enviamos al service.
      expect(mockMascotasRepository.create).toHaveBeenCalledWith(
        createMascotaDto,
      );


      // Verificamos que la entidad generada
      // por create() haya sido enviada a save().
      expect(mockMascotasRepository.save).toHaveBeenCalledWith(
        mascotaCreada,
      );


      // Después de guardar, nuestro service
      // vuelve a buscar la mascota utilizando el ID generado
      // e incluyendo la relación usuario.
      //
      // Comprobamos que esa búsqueda se haya realizado
      // con los parámetros correctos.
      expect(mockMascotasRepository.findOne).toHaveBeenCalledWith({
        where: { id: mascotaGuardada.id },
        relations: ['usuario'],
      });


      // Finalmente comprobamos que create()
      // haya devuelto la mascota completa esperada.
      expect(result).toEqual(mascotaCompleta);

    });

  });

});