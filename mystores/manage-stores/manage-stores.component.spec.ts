import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStoresComponent } from './manage-stores.component';

describe('ManageStoresComponent', () => {
  let component: ManageStoresComponent;
  let fixture: ComponentFixture<ManageStoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageStoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
