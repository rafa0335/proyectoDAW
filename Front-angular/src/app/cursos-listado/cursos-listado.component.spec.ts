import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosListadoComponent } from './cursos-listado.component';

describe('CursosListadoComponent', () => {
  let component: CursosListadoComponent;
  let fixture: ComponentFixture<CursosListadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CursosListadoComponent]
    });
    fixture = TestBed.createComponent(CursosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
