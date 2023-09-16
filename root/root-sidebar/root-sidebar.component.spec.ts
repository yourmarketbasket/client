import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootSidebarComponent } from './root-sidebar.component';

describe('RootSidebarComponent', () => {
  let component: RootSidebarComponent;
  let fixture: ComponentFixture<RootSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RootSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
