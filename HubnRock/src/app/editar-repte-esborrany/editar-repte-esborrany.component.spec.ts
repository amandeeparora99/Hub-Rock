import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRepteEsborranyComponent } from './editar-repte-esborrany.component';

describe('EditarEsborranyComponent', () => {
  let component: EditarRepteEsborranyComponent;
  let fixture: ComponentFixture<EditarRepteEsborranyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditarRepteEsborranyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarRepteEsborranyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
