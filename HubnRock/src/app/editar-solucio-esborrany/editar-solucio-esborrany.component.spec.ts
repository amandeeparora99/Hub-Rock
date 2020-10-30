import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSolucioEsborranyComponent } from './editar-solucio-esborrany.component';

describe('EditarSolucioEsborranyComponent', () => {
  let component: EditarSolucioEsborranyComponent;
  let fixture: ComponentFixture<EditarSolucioEsborranyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarSolucioEsborranyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarSolucioEsborranyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
