import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaSidebarComponent } from './qa-sidebar.component';

describe('QaSidebarComponent', () => {
  let component: QaSidebarComponent;
  let fixture: ComponentFixture<QaSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QaSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QaSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
