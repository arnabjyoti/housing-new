import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairMaintenanceRequestComponent } from './repair-maintenance-request.component';

describe('RepairMaintenanceRequestComponent', () => {
  let component: RepairMaintenanceRequestComponent;
  let fixture: ComponentFixture<RepairMaintenanceRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepairMaintenanceRequestComponent]
    });
    fixture = TestBed.createComponent(RepairMaintenanceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
