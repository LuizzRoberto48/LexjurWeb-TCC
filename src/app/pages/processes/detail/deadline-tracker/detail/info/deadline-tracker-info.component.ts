import { Component, Input } from '@angular/core';
import { IDeadlineTracker } from 'app/modules/deadline-trackers/model/deadline-tracker.model';
import { Location } from '@angular/common';

@Component({
  selector: 'deadline-tracker-info',
  templateUrl: './deadline-tracker-info.component.html'
})
export class DeadlineTrackerInfoComponent {

  @Input() info:IDeadlineTracker;
  constructor(private location: Location){}

  back() {
    this.location.back();
  }
}
