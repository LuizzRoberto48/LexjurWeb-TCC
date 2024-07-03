import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { FinishedProcess } from './model/finished_process.model';

@Injectable({
  providedIn: 'root',
})
export class FinishedProcessService {
  constructor(private _http: HttpClient) {}

  create(finishedProcess: FinishedProcess, processId: number) {
    return this._http.post<FinishedProcess>(
      `${environment.apiURL}/finished_process/${processId}`,
      finishedProcess,
    );
  }

  update(finishedProcess: FinishedProcess) {
    if (!finishedProcess.id) throw new Error('Id undefined');
    return this._http.put<FinishedProcess>(
      `${environment.apiURL}/finished_process/${finishedProcess.id}`,
      finishedProcess,
    );
  }

  findOne(id:number) {
    return this._http.get<FinishedProcess>(
      `${environment.apiURL}/finished_process/${id}`,
    );
  }
}
