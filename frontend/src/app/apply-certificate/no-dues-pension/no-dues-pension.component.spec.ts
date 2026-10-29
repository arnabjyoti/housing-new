import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDuesPensionComponent } from './no-dues-pension.component';

describe('NoDuesPensionComponent', () => {
  let component: NoDuesPensionComponent;
  let fixture: ComponentFixture<NoDuesPensionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoDuesPensionComponent]
    });
    fixture = TestBed.createComponent(NoDuesPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
