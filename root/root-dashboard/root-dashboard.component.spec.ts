import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootDashboardComponent } from './root-dashboard.component';

describe('RootDashboardComponent', () => {
  let component: RootDashboardComponent;
  let fixture: ComponentFixture<RootDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RootDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
