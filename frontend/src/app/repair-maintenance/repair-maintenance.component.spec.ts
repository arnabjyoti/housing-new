import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairMaintenanceComponent } from './repair-maintenance.component';

describe('RepairMaintenanceComponent', () => {
  let component: RepairMaintenanceComponent;
  let fixture: ComponentFixture<RepairMaintenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepairMaintenanceComponent]
    });
    fixture = TestBed.createComponent(RepairMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
