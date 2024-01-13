import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { ParamsModel } from 'app/global/base-http/base-http.model';
import { ProcessService } from '../process/process.service';
import { Observable, switchMap } from 'rxjs';
import { Process } from '../process/models/process.model';
import { DateTime } from 'luxon';
import { ProcessProgress } from './models/progress.model';

@Injectable({
  providedIn: 'any',
})
export class ProcessProgressService extends BaseHttpService<any> {
  constructor(
    protected injector: Injector,
    private processService: ProcessService,
  ) {
    super('/process_progress', injector, ProcessProgress.fromJson);
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  findByProcess(): Observable<any> {
    return this.$process.pipe(
      switchMap((process: Process) => {
        const params: ParamsModel[] = [];
        params.push({ name: 'processId', value: process.id });
        return this.findAll(params);
      }),
    );
  }
  
}
