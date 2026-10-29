import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterRenewalComponent } from './quarter-renewal.component';

describe('QuarterRenewalComponent', () => {
  let component: QuarterRenewalComponent;
  let fixture: ComponentFixture<QuarterRenewalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterRenewalComponent]
    });
    fixture = TestBed.createComponent(QuarterRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
