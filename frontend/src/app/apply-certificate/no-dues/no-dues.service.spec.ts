import { TestBed } from '@angular/core/testing';

import { NoDuesService } from './no-dues.service';

describe('NoDuesService', () => {
  let service: NoDuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoDuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
