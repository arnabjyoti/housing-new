import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterRequestComponent } from './quarter-request.component';

describe('QuarterRequestComponent', () => {
  let component: QuarterRequestComponent;
  let fixture: ComponentFixture<QuarterRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterRequestComponent]
    });
    fixture = TestBed.createComponent(QuarterRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
