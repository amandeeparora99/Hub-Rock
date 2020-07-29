import { TestBed } from '@angular/core/testing';

import { HttpCommunicationService } from './http-communication.service';

describe('HttpCommunicationService', () => {
  let service: HttpCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
