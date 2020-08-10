import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepteComponent } from './repte.component';

describe('RepteComponent', () => {
  let component: RepteComponent;
  let fixture: ComponentFixture<RepteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
