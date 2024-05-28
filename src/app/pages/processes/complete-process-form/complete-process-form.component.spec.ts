import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteProcessFormComponent } from './complete-process-form.component';

describe('CompleteProcessFormComponent', () => {
  let component: CompleteProcessFormComponent;
  let fixture: ComponentFixture<CompleteProcessFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteProcessFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteProcessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
