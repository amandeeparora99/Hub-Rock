import { TestBed } from '@angular/core/testing';

import { RepteCanViewGuard } from './repte-can-view.guard';

describe('RepteCanViewGuard', () => {
  let guard: RepteCanViewGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RepteCanViewGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
