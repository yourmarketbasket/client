import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewProductsComponent } from './review-products.component';

describe('ReviewProductsComponent', () => {
  let component: ReviewProductsComponent;
  let fixture: ComponentFixture<ReviewProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
