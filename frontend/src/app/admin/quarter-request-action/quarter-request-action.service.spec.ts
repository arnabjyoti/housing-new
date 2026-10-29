import { TestBed } from '@angular/core/testing';

import { QuarterRequestActionService } from './quarter-request-action.service';

describe('QuarterRequestActionService', () => {
  let service: QuarterRequestActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuarterRequestActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
