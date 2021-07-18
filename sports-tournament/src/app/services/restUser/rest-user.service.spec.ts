import { TestBed } from '@angular/core/testing';

import { RestUserService } from './rest-user.service';

describe('RestUserService', () => {
  let service: RestUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
