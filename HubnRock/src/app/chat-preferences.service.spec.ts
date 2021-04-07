import { TestBed } from '@angular/core/testing';

import { ChatPreferencesService } from './chat-preferences.service';

describe('ChatPreferencesService', () => {
  let service: ChatPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatPreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
