    import { TestBed } from '@angular/core/testing';
    import { provideHttpClient } from '@angular/common/http';
    import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

    import { ListaUsuarios } from './lista-usuarios';
    import { Usuario } from '../interfaces/usuario';
    import { environment } from '../../environments/environment';

    //Agrupa los test relacionados con la integracion de ListaUsuarios
    //Prueba la integración entre ListaUsuarios, UsuariosService y HttpClient
    describe('ListaUsuarios Integration Test', () => { 
    //Componente real que se va a probar
        let component: ListaUsuarios;

    //Permite controlar las peticiones HTTP realizadas durante el test
        let httpTesting: HttpTestingController; //Herramienta de angular que permite controlar las peticiones HTTP durante el test


    //Se ejecuta antes de cada test
        beforeEach(async () => {

        //Se crea el entorno de testing usando el componente real
        //No se mockea ListaUsuarios ni UsuariosService
        await TestBed.configureTestingModule({ //TestBed es una herramienta de angular que crea un entorno de prueba

        imports: [ ListaUsuarios ],
        providers: [
            //Permite que UsuariosService use HttpClient
            provideHttpClient(),
            //Permite controlar las peticiones HTTP sin conectarse al backend
            provideHttpClientTesting()
        ]
        }).compileComponents();

        //Se crea el componente ListaUsuarios real usando el entorno de testing
        const fixture = TestBed.createComponent(ListaUsuarios); //Fixture es un contenedor que permite acceder al componente

        //Se obtiene la instancia real de ListaUsuarios, sin las demas herramientas de tetsing que tiene fixture
        component = fixture.componentInstance;

        //Se obtiene el controlador de las peticiones HTTP del test creado en el modulo de testing
        httpTesting = TestBed.inject(HttpTestingController);

        });


    //Test
        it('Carga usuarios', () => {

        //Arrange
        //Se crean los usuarios simulados que devolveria el backend
        const usuarios = [
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

        //Act
        //Se ejecuta el ngOnInit real de ListaUsuarios
        component.ngOnInit();

        //Se obtiene la peticion que UsuariosService hizo al endpoint de usuarios
        //Verifica que la peticion haya sido a usuarios
        const request = httpTesting.expectOne(`${environment.apiUrl}/usuarios`);

        //Se simula la respuesta HTTP con los usuarios
        request.flush(usuarios); //Flush herramienta de angular que simula peticiones hhtp

        //Assert
        //Se comprueba que ListaUsuarios guardo correctamente
        //los datos obtenidos mediante UsuariosService
        expect(component.usuarios).toEqual(usuarios);
        });


    //Se ejecuta despues de cada test
        afterEach(() => {

        //Comprueba que no hayan quedado peticiones HTTP pendientes
        httpTesting.verify();

        })
    });