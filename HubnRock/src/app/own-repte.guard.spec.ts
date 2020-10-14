import { TestBed } from '@angular/core/testing';

import { OwnRepteGuard } from './own-repte.guard';

describe('OwnRepteGuard', () => {
  let guard: OwnRepteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OwnRepteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
