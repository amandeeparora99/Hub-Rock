import { TestBed } from '@angular/core/testing';

import { HttperrorinterceptorInterceptor } from './httperrorinterceptor.interceptor';

describe('HttperrorinterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttperrorinterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttperrorinterceptorInterceptor = TestBed.inject(HttperrorinterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
