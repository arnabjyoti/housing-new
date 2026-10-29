import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NocMacpRequestComponent } from './noc-macp-request.component';

describe('NocMacpRequestComponent', () => {
  let component: NocMacpRequestComponent;
  let fixture: ComponentFixture<NocMacpRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NocMacpRequestComponent]
    });
    fixture = TestBed.createComponent(NocMacpRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
