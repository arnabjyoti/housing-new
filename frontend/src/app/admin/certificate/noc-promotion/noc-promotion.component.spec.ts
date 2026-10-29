import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NocPromotionComponent } from './noc-promotion.component';

describe('NocPromotionComponent', () => {
  let component: NocPromotionComponent;
  let fixture: ComponentFixture<NocPromotionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NocPromotionComponent]
    });
    fixture = TestBed.createComponent(NocPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
