import { TestBed } from '@angular/core/testing';

import { QuarterRenewalService } from './quarter-renewal.service';

describe('QuarterRenewalService', () => {
  let service: QuarterRenewalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuarterRenewalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
