import { TestBed } from '@angular/core/testing';

import { NoAccomodationService } from './no-accomodation.service';

describe('NoAccomodationService', () => {
  let service: NoAccomodationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoAccomodationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
