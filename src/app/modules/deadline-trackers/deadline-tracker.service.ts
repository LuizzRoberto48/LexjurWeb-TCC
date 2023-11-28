import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { DeadlineTracker } from './model/deadline-tracker.model';
import { ParamsModel } from 'app/global/base-http/base-http.model';
import { ProcessService } from '../process/process.service';
import { Observable, switchMap } from 'rxjs';
import { Process } from '../process/models/process.model';

@Injectable({
  providedIn: 'any',
})
export class DeadlineTrackerService extends BaseHttpService<any> {
  constructor(
    protected injector: Injector,
    private processService: ProcessService,
  ) {
    super('/deadline_trackers', injector, DeadlineTracker.fromJson);
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  findProcessResources(): Observable<any> {
    return this.$process.pipe(
      switchMap((process: Process) => {
        const params: ParamsModel[] = [];
        params.push({ name: 'processId', value: process.id });
        return this.findAll(params, 'process_resources');
      }),
    );
  }
}
