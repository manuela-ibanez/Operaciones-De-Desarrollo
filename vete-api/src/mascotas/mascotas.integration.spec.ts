//Funciones de Jest que se usan para definir y ejecutar los test
//describe agrupa los test
//beforeAll se ejecuta una vez antes de todos los test
//afterAll se ejecuta una vez despues de todos los test
//it define un caso de prueba
//expect comprueba que el resultado sea el esperado
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { MascotasController } from './mascotas.controller';

//Agrupa los test relacionados con la integracion de Mascotas
describe('Mascotas Integration Test', () => {
  //Controller real que se va a probar
  let controller: MascotasController;

  //Modulo de Nest que se usa durante el test
  let module: TestingModule | undefined;

  //Se ejecuta una vez antes de todos los test
  beforeAll(async () => {
    //Se crea el modulo de testing usando el AppModule real
    //No se mockea ninguna parte de la aplicacion
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    //Se obtiene el controller real creado por Nest
    controller = module.get<MascotasController>(MascotasController);
  }, 30000); //La conexion inicial puede tardar mas de los 5 segundos de Jest

  //Define un caso de prueba
  it('Lista de mascotas', async () => {
    //Arrange
    //No se necesitan mocks ni datos simulados
    //Se usa la base de datos real

    //Act
    //Se llama al controller real
    //El controller llama al service real
    //El service llama al repository real y a la base de datos
    const result = await controller.findAll();

    //Assert
    //Se comprueba que el resultado sea una lista
    expect(Array.isArray(result)).toBe(true);
  });

  //Se ejecuta una vez despues de todos los test
  afterAll(async () => {
    //Se cierra el modulo si llego a crearse y se liberan las conexiones
    await module?.close();
  });
});
