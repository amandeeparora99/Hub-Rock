import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermesICondicionsComponent } from './termes-i-condicions.component';

describe('TermesICondicionsComponent', () => {
  let component: TermesICondicionsComponent;
  let fixture: ComponentFixture<TermesICondicionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermesICondicionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermesICondicionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
