import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudSolucionsComponent } from './crud-solucions.component';

describe('CrudSolucionsComponent', () => {
  let component: CrudSolucionsComponent;
  let fixture: ComponentFixture<CrudSolucionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudSolucionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudSolucionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
