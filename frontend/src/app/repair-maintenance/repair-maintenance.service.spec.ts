import { TestBed } from '@angular/core/testing';

import { RepairMaintenanceService } from './repair-maintenance.service';

describe('RepairMaintenanceService', () => {
  let service: RepairMaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepairMaintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
