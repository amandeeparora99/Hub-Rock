import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacioRepteComponent } from './creacio-repte.component';

describe('CreacioRepteComponent', () => {
  let component: CreacioRepteComponent;
  let fixture: ComponentFixture<CreacioRepteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreacioRepteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacioRepteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
