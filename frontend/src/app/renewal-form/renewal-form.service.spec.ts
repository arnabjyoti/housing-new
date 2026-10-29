import { TestBed } from '@angular/core/testing';

import { RenewalFormService } from './renewal-form.service';

describe('RenewalFormService', () => {
  let service: RenewalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenewalFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
