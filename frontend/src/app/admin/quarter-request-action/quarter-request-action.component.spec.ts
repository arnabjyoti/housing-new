import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterRequestActionComponent } from './quarter-request-action.component';

describe('QuarterRequestActionComponent', () => {
  let component: QuarterRequestActionComponent;
  let fixture: ComponentFixture<QuarterRequestActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterRequestActionComponent]
    });
    fixture = TestBed.createComponent(QuarterRequestActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
