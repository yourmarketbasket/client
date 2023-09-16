import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatestoreComponent } from './createstore.component';

describe('CreatestoreComponent', () => {
  let component: CreatestoreComponent;
  let fixture: ComponentFixture<CreatestoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatestoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
