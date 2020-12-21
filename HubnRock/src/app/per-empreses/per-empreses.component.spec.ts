import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerEmpresesComponent } from './per-empreses.component';

describe('SobreHubandrockComponent', () => {
  let component: PerEmpresesComponent;
  let fixture: ComponentFixture<PerEmpresesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerEmpresesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerEmpresesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
