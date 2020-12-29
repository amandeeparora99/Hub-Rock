import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreHubandrockComponent } from './sobre-hubandrock.component';

describe('SobreHubandrockComponent', () => {
  let component: SobreHubandrockComponent;
  let fixture: ComponentFixture<SobreHubandrockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SobreHubandrockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SobreHubandrockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
