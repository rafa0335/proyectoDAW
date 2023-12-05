import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosAlumnosComponent } from './cursos-alumnos.component';

describe('CursosAlumnosComponent', () => {
  let component: CursosAlumnosComponent;
  let fixture: ComponentFixture<CursosAlumnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CursosAlumnosComponent]
    });
    fixture = TestBed.createComponent(CursosAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
