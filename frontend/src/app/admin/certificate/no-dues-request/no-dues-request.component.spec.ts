import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDuesRequestComponent } from './no-dues-request.component';

describe('NoDuesRequestComponent', () => {
  let component: NoDuesRequestComponent;
  let fixture: ComponentFixture<NoDuesRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoDuesRequestComponent]
    });
    fixture = TestBed.createComponent(NoDuesRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
