import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolucioComponent } from './solucio.component';

describe('SolucioComponent', () => {
  let component: SolucioComponent;
  let fixture: ComponentFixture<SolucioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolucioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolucioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
