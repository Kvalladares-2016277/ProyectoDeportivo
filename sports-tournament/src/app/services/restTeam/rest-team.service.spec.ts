import { TestBed } from '@angular/core/testing';

import { RestTeamService } from './rest-team.service';

describe('RestTeamService', () => {
  let service: RestTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
