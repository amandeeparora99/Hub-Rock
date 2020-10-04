import { TestBed } from '@angular/core/testing';

import { OwnUserGuard } from './own-user.guard';

describe('OwnUserGuard', () => {
  let guard: OwnUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OwnUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
