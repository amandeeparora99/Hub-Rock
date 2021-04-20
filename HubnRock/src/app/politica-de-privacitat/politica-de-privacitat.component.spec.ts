import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaDePrivacitatComponent } from './politica-de-privacitat.component';

describe('PoliticaDePrivacitatComponent', () => {
  let component: PoliticaDePrivacitatComponent;
  let fixture: ComponentFixture<PoliticaDePrivacitatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliticaDePrivacitatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticaDePrivacitatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
