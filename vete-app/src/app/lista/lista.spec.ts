import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Lista } from './lista';

describe('Lista', () => {

  let component: Lista;
  let fixture: ComponentFixture<Lista>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [Lista],

      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(Lista);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});