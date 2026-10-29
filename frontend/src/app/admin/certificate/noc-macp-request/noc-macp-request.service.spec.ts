import { TestBed } from '@angular/core/testing';

import { NocMacpRequestService } from './noc-macp-request.service';

describe('NocMacpRequestService', () => {
  let service: NocMacpRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NocMacpRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
