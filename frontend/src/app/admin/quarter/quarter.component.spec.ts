import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterComponent } from './quarter.component';

describe('QuarterComponent', () => {
  let component: QuarterComponent;
  let fixture: ComponentFixture<QuarterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterComponent]
    });
    fixture = TestBed.createComponent(QuarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
