import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { DeadlineTracker } from './model/deadline-tracker.model';
import { ParamsModel } from 'app/global/base-http/base-http.model';
import { ProcessService } from '../process/services/process.service';
import { Observable, switchMap } from 'rxjs';
import { Process } from '../process/models/process.model';
import { DateTime } from 'luxon';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { httpParams } from '../process/utils';

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

  findAllPaginated(coreId:number, queryParams: {}): Observable<any> {
    const params = httpParams(queryParams);
    return this.http.get<any>(`${environment.apiURL}/deadline_trackers/${coreId}/all`, {
      params,
    });
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

  internalDateWithHour(date: DateTime | string, time?: string): string {
    const [hour, minute] = (time ?? '00:00').split(':');
    let isoDate = date;
    if (date instanceof DateTime) {
      isoDate = date
        .set({
          hour: +hour || 0,
          minute: +minute || 0,
        })
        .toUTC()
        .toISO();
    }
    return <string>isoDate;
  }

  completeDeadline(id: number, finishedNote: string) {
    const url = `${environment.apiURL}/deadline_trackers/complete/${id}`;
    return this.http.put(url, { finishedNote });
  }
}
