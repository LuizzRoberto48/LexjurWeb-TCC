import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/core/global/services/base-http.service';
import { Schedule } from './model/schedule.model';

@Injectable({
  providedIn:'any'
})
export class ScheduleService extends BaseHttpService<any> {
  constructor(protected injector: Injector) {
    super('/deadline_trackers', injector, Schedule.fromJson);
  }
}
