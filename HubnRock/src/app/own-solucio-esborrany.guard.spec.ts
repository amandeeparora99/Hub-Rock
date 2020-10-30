import { TestBed } from '@angular/core/testing';

import { OwnSolucioEsborranyGuard } from './own-solucio-esborrany.guard';

describe('OwnSolucioEsborranyGuard', () => {
  let guard: OwnSolucioEsborranyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OwnSolucioEsborranyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
