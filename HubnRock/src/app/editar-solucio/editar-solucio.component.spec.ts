import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSolucioComponent } from './editar-solucio.component';

describe('EditarSolucioComponent', () => {
  let component: EditarSolucioComponent;
  let fixture: ComponentFixture<EditarSolucioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarSolucioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarSolucioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
