import { TestBed } from '@angular/core/testing';

import { CompanyRoleGuard } from './company-role.guard';

describe('CompanyRoleGuard', () => {
  let guard: CompanyRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CompanyRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
