import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteDeadlineTrackerComponent } from './complete-deadline-tracker.component';

describe('CompleteDeadlineTrackerComponent', () => {
  let component: CompleteDeadlineTrackerComponent;
  let fixture: ComponentFixture<CompleteDeadlineTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteDeadlineTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteDeadlineTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
