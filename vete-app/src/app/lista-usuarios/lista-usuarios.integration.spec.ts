    import { TestBed } from '@angular/core/testing';
    import { provideHttpClient } from '@angular/common/http';
    import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

    import { ListaUsuarios } from './lista-usuarios';
    import { Usuario } from '../interfaces/usuario';
    import { environment } from '../../environments/environment';

    //Agrupa los test relacionados con la integracion de ListaUsuarios
    describe('ListaUsuarios Integration Test', () => { 
    //Componente real que se va a probar
        let component: ListaUsuarios;

    //Permite controlar las peticiones HTTP realizadas durante el test
        let httpTesting: HttpTestingController;


    //Se ejecuta antes de cada test
        beforeEach(async () => {

        //Se crea el entorno de testing usando el componente real
        //No se mockea ListaUsuarios ni UsuariosService
        await TestBed.configureTestingModule({

        imports: [ ListaUsuarios ],
        providers: [
            //Permite que UsuariosService use HttpClient
            provideHttpClient(),
            //Permite controlar las peticiones HTTP sin conectarse al backend
            provideHttpClientTesting()
        ]
        }).compileComponents();

        //Angular crea el componente real
        const fixture = TestBed.createComponent(ListaUsuarios);

        //Se obtiene la instancia real del componente
        component = fixture.componentInstance;

        //Se obtiene el controlador de las peticiones HTTP del test
        httpTesting = TestBed.inject(HttpTestingController);

        });


    //Test
        it('Cargs usuarios', () => {

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
        const request = httpTesting.expectOne(`${environment.apiUrl}/usuarios`);

        //Se simula la respuesta HTTP con los usuarios
        request.flush(usuarios);

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