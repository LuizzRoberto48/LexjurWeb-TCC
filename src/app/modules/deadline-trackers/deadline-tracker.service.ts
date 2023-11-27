import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { DeadlineTracker } from './model/deadline-tracker.model';


@Injectable({
  providedIn:'any'
})
export class DeadlineTrackerService extends BaseHttpService<any> {
  constructor(protected injector: Injector) {
    super('/deadline_trackers', injector, DeadlineTracker.fromJson);
  }
}
