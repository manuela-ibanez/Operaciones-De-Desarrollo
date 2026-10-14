import { UsuariosService } from '../services/usuarios'
import { Usuario } from '../interfaces/usuario'
import { ListaUsuarios } from './lista-usuarios';
import { of } from 'rxjs';

describe('ListaUsuarios', () => { //Agrupa los test relacionados con ListaUsuarios
  //Componente real que se quiere probar
  let component: ListaUsuarios;

  //Se simula el service, no hay que conectarse al backend
  const mockUsuariosService = jasmine.createSpyObj<UsuariosService>(
    'UsuariosService', ['getAll']); //createSpyObj recibe una lista con los metodos que se quieren simular, y jasmine crea una función mock para cada uno

  beforeEach(() => {
    //Se crea el componente y se le pasa el service mockeado
    component = new ListaUsuarios(mockUsuariosService);
    //Se limpian las llamadas anteriores al mock
    mockUsuariosService.getAll.calls.reset();
  });


  //Test 1
  it('Debería activar la edición de un usuario', () => {
    //Arrange
    //Se define el id del usuario que se va a editar
    const usuarioId = 1;
    component.editarUsuarioId = null;

    //Act
    component.editUsuario(usuarioId);

    //Assert
    expect(component.editarUsuarioId).toBe(usuarioId);
  });

  //Test 2
  it('Debería cargar correctamente los usuarios al iniciar', () => {
    //Arrange
    //Se simulan los usuarios que se van a usar en el test
    const mockUsuarios = [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juan@mail.com',
        mascotas: []
      },
      {
        id: 2,
        nombre: 'Ana',
        apellido: 'Lopez',
        email: 'ana@mail.com',
        mascotas: []
      }
    ] as Usuario[];

    //Cuando se llama al getAll del service se devuelven los usuarios simulados
    mockUsuariosService.getAll.and.returnValue(of(mockUsuarios));

    //Act
    component.ngOnInit(); //Le dice a angular que ejecute ngOnInit
    //Assert
    //Lo que guardó el componente es component.usuarios
    expect(component.usuarios).toEqual(mockUsuarios);
  });
});