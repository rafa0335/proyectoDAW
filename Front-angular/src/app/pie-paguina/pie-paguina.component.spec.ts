import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiePaguinaComponent } from './pie-paguina.component';

describe('PiePaguinaComponent', () => {
  let component: PiePaguinaComponent;
  let fixture: ComponentFixture<PiePaguinaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiePaguinaComponent]
    });
    fixture = TestBed.createComponent(PiePaguinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
