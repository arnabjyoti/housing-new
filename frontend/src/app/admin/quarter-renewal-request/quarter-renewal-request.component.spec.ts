import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterRenewalRequestComponent } from './quarter-renewal-request.component';

describe('QuarterRenewalRequestComponent', () => {
  let component: QuarterRenewalRequestComponent;
  let fixture: ComponentFixture<QuarterRenewalRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterRenewalRequestComponent]
    });
    fixture = TestBed.createComponent(QuarterRenewalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
