import { TestBed } from '@angular/core/testing';

import { RestSoccerGameService } from './rest-soccer-game.service';

describe('RestSoccerGameService', () => {
  let service: RestSoccerGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestSoccerGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
