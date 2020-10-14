import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudReptesComponent } from './crud-reptes.component';

describe('CrudReptesComponent', () => {
  let component: CrudReptesComponent;
  let fixture: ComponentFixture<CrudReptesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudReptesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudReptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
