import { TestBed } from '@angular/core/testing';

import { NoDuesRequestService } from './no-dues-request.service';

describe('NoDuesRequestService', () => {
  let service: NoDuesRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoDuesRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
