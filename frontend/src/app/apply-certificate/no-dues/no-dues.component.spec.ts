import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDuesComponent } from './no-dues.component';

describe('NoDuesComponent', () => {
  let component: NoDuesComponent;
  let fixture: ComponentFixture<NoDuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoDuesComponent]
    });
    fixture = TestBed.createComponent(NoDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
