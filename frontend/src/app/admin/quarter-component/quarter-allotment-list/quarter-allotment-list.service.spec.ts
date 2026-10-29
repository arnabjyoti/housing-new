import { TestBed } from '@angular/core/testing';

import { QuarterAllotmentListService } from './quarter-allotment-list.service';

describe('QuarterAllotmentListService', () => {
  let service: QuarterAllotmentListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuarterAllotmentListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
