import { TestBed } from '@angular/core/testing';

import { NocPromotionService } from './noc-promotion.service';

describe('NocPromotionService', () => {
  let service: NocPromotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NocPromotionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
