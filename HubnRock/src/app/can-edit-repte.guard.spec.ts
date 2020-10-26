import { TestBed } from '@angular/core/testing';

import { CanEditRepteGuard } from './can-edit-repte.guard';

describe('CanEditRepteGuard', () => {
  let guard: CanEditRepteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanEditRepteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
