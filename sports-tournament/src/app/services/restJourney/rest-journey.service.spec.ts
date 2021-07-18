import { TestBed } from '@angular/core/testing';

import { RestJourneyService } from './rest-journey.service';

describe('RestJourneyService', () => {
  let service: RestJourneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestJourneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
