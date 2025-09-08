import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAttachComponent } from './new-attach.component';

describe('NewAttachComponent', () => {
  let component: NewAttachComponent;
  let fixture: ComponentFixture<NewAttachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAttachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
