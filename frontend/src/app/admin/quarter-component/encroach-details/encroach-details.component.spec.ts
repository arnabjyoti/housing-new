import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncroachDetailsComponent } from './encroach-details.component';

describe('EncroachDetailsComponent', () => {
  let component: EncroachDetailsComponent;
  let fixture: ComponentFixture<EncroachDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncroachDetailsComponent]
    });
    fixture = TestBed.createComponent(EncroachDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
