import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { DeadlineTrackerSubTypes } from './model/deadline-tracker-subtype.model';

@Injectable({
  providedIn: 'any',
})
export class DeadlineTrackerSubTypeService extends BaseHttpService<any> {
  constructor(protected injector: Injector) {
    super('/deadline_tracker_subtypes', injector, DeadlineTrackerSubTypes.fromJson);
  }
}
