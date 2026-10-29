import { TestBed } from '@angular/core/testing';

import { NoDuesPensionService } from './no-dues-pension.service';

describe('NoDuesPensionService', () => {
  let service: NoDuesPensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoDuesPensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
