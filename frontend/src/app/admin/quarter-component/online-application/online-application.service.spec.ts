import { TestBed } from '@angular/core/testing';

import { OnlineApplicationService } from './online-application.service';

describe('OnlineApplicationService', () => {
  let service: OnlineApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
