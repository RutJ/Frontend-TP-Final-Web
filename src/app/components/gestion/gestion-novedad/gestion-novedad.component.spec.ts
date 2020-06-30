import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionNovedadComponent } from './gestion-novedad.component';

describe('GestionNovedadComponent', () => {
  let component: GestionNovedadComponent;
  let fixture: ComponentFixture<GestionNovedadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionNovedadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionNovedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
