import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDeAlumnosComponent } from './listado-de-alumnos.component';

describe('ListadoDeAlumnosComponent', () => {
  let component: ListadoDeAlumnosComponent;
  let fixture: ComponentFixture<ListadoDeAlumnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadoDeAlumnosComponent]
    });
    fixture = TestBed.createComponent(ListadoDeAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
