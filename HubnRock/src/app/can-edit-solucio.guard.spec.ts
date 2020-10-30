import { TestBed } from '@angular/core/testing';

import { CanEditSolucioGuard } from './can-edit-solucio.guard';

describe('CanEditSolucioGuard', () => {
  let guard: CanEditSolucioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanEditSolucioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
