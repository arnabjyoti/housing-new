import { TestBed } from '@angular/core/testing';

import { EncroachDetailsService } from './encroach-details.service';

describe('EncroachDetailsService', () => {
  let service: EncroachDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncroachDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
