import { TestBed } from '@angular/core/testing';

import { QuarterRequestService } from './quarter-request.service';

describe('QuarterRequestService', () => {
  let service: QuarterRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuarterRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
