import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacioSolucioComponent } from './creacio-solucio.component';

describe('CreacioSolucioComponent', () => {
  let component: CreacioSolucioComponent;
  let fixture: ComponentFixture<CreacioSolucioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreacioSolucioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacioSolucioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
