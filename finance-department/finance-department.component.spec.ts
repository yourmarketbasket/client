import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceDepartmentComponent } from './finance-department.component';

describe('FinanceDepartmentComponent', () => {
  let component: FinanceDepartmentComponent;
  let fixture: ComponentFixture<FinanceDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
