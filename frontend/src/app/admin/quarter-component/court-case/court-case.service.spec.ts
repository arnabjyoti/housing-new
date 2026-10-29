import { TestBed } from '@angular/core/testing';

import { CourtCaseService } from './court-case.service';

describe('CourtCaseService', () => {
  let service: CourtCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourtCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
