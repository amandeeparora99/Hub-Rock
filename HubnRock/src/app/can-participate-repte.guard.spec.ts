import { TestBed } from '@angular/core/testing';

import { CanParticipateRepteGuard } from './can-participate-repte.guard';

describe('CanParticipateRepteGuard', () => {
  let guard: CanParticipateRepteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanParticipateRepteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
