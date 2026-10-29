import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NocComponent } from './noc.component';

describe('NocComponent', () => {
  let component: NocComponent;
  let fixture: ComponentFixture<NocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NocComponent]
    });
    fixture = TestBed.createComponent(NocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
