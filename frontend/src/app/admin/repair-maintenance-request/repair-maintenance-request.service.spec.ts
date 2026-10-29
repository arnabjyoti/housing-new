import { TestBed } from '@angular/core/testing';

import { RepairMaintenanceRequestService } from './repair-maintenance-request.service';

describe('RepairMaintenanceRequestService', () => {
  let service: RepairMaintenanceRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepairMaintenanceRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
