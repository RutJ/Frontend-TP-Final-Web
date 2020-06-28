import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionServicioComponent } from './gestion-servicio.component';

describe('GestionServicioComponent', () => {
  let component: GestionServicioComponent;
  let fixture: ComponentFixture<GestionServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
