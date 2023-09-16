import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaHeaderComponent } from './qa-header.component';

describe('QaHeaderComponent', () => {
  let component: QaHeaderComponent;
  let fixture: ComponentFixture<QaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QaHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
