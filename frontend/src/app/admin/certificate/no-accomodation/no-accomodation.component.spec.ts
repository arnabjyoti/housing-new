import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccomodationComponent } from './no-accomodation.component';

describe('NoAccomodationComponent', () => {
  let component: NoAccomodationComponent;
  let fixture: ComponentFixture<NoAccomodationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoAccomodationComponent]
    });
    fixture = TestBed.createComponent(NoAccomodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
