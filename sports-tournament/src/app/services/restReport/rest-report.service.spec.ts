import { TestBed } from '@angular/core/testing';

import { RestReportService } from './rest-report.service';

describe('RestReportService', () => {
  let service: RestReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
