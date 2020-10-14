import { TestBed } from '@angular/core/testing';

import { OwnRepteEsborranyGuard } from './own-repte-esborrany.guard';

describe('OwnRepteEsborranyGuard', () => {
  let guard: OwnRepteEsborranyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OwnRepteEsborranyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
