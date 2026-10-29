import { TestBed } from '@angular/core/testing';

import { QuarterRenewalRequestService } from './quarter-renewal-request.service';

describe('QuarterRenewalRequestService', () => {
  let service: QuarterRenewalRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuarterRenewalRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
