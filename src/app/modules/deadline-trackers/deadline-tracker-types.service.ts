import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { DeadlineTrackerTypes } from './model/deadline-tracker-type.model';

@Injectable({
  providedIn: 'any',
})
export class DeadlineTrackerTypeService extends BaseHttpService<any> {
  constructor(protected injector: Injector) {
    super('/deadline_tracker_types', injector, DeadlineTrackerTypes.fromJson);
  }
}
