import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterAllotmentListComponent } from './quarter-allotment-list.component';

describe('QuarterAllotmentListComponent', () => {
  let component: QuarterAllotmentListComponent;
  let fixture: ComponentFixture<QuarterAllotmentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterAllotmentListComponent]
    });
    fixture = TestBed.createComponent(QuarterAllotmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
