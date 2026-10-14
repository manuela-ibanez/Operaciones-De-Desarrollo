import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { MascotasService } from './mascotas';

describe('MascotasService', () => {

  let service: MascotasService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        MascotasService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(MascotasService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});