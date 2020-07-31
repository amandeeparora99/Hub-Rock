import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReptesComponent } from './reptes.component';

describe('ReptesComponent', () => {
  let component: ReptesComponent;
  let fixture: ComponentFixture<ReptesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReptesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
