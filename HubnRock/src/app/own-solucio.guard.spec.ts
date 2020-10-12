import { TestBed } from '@angular/core/testing';

import { OwnSolucioGuard } from './own-solucio.guard';

describe('OwnSolucioGuard', () => {
  let guard: OwnSolucioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OwnSolucioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
