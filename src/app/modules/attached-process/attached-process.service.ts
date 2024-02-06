import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import {
  AttachedProcessDTO,
  GetAttachedProcess,
} from './attached-process.model';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'any',
})
export class AttachedProcessService extends BaseHttpService<any> {
  private _linkedProcess$: Subject<GetAttachedProcess> = new Subject();
  $updateLinkedProcess = this._linkedProcess$.asObservable();

  constructor(protected injector: Injector) {
    super('/attached_processes', injector, AttachedProcessDTO.fromJson);
  }

  set linkedProcess(linkedProcess: GetAttachedProcess) {
    this._linkedProcess$.next(linkedProcess);
  }
}
