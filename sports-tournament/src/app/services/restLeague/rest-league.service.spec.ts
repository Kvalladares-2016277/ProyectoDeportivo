import { TestBed } from '@angular/core/testing';

import { RestLeagueService } from './rest-league.service';

describe('RestLeagueService', () => {
  let service: RestLeagueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestLeagueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
