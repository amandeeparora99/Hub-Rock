import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerStartupsComponent } from './per-startups.component';

describe('PerStartupsComponent', () => {
  let component: PerStartupsComponent;
  let fixture: ComponentFixture<PerStartupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerStartupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerStartupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
