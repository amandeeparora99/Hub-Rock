import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRepteComponent } from './editar-repte.component';

describe('EditarRepteComponent', () => {
  let component: EditarRepteComponent;
  let fixture: ComponentFixture<EditarRepteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarRepteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarRepteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
