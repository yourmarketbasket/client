import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectStoreDialogComponent } from './select-store-dialog.component';

describe('SelectStoreDialogComponent', () => {
  let component: SelectStoreDialogComponent;
  let fixture: ComponentFixture<SelectStoreDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectStoreDialogComponent]
    });
    fixture = TestBed.createComponent(SelectStoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
