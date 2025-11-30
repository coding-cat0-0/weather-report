import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisasterAlertsComponent } from './disaster-alerts.component';

describe('DisasterAlertsComponent', () => {
  let component: DisasterAlertsComponent;
  let fixture: ComponentFixture<DisasterAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisasterAlertsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisasterAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
