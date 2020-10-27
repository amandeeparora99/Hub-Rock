import { TestBed } from '@angular/core/testing';

import { SolucioCanViewGuard } from './solucio-can-view.guard';

describe('SolucioCanViewGuard', () => {
  let guard: SolucioCanViewGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SolucioCanViewGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
