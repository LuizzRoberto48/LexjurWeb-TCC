import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  ActionType,
  AdverseStakeholder,
  Client,
  County,
  CreateProcess,
  EletronicSystem,
  Forum,
  GetProcessPageable,
  LawArea,
  LawSubArea,
  Object,
  Organ,
  Origin,
  Phase,
  Process,
  SendProcessStatus,
  Stakeholder,
  Subject,
  SubObject,
} from '../models/process.model';
import { httpParams } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private _process$: BehaviorSubject<Process> = new BehaviorSubject(null);
  $obsevableProcess = this._process$.asObservable();
  constructor(private _http: HttpClient) {}

  updateProcessMemory(process) {
    this._process$.next({ ...process });
  }

  getProcessById(id: number): Observable<Process> {
    return this._http.get<Process>(`${environment.apiURL}/processes/${id}`);
  }

  getProcessByCore(
    queryParams: {},
  ): Observable<GetProcessPageable> {
    const params = httpParams(queryParams);
    return this._http
      .get<GetProcessPageable>(
        `${environment.apiURL}/processes`,
        { params },
      )
      .pipe(
        map((res) => {
          const process = res.process.map((p) => ({
            ...p,
            insideLawyer: this.getInsideLawyerByProcess(p),
            outsidelawyer: this.getOutsideLawyerByProcess(p),
          }));
          return { process, totalItems: res.totalItems };
        }),
      );
  }

  getProcessByParams(
    query: any,
  ): Observable<any> {
    console.log(query)
    const params = httpParams(query);
    return this._http.get<any>(
      `${environment.apiURL}/attached_processes`,
      { params },
    );
  }

  set memoryProcess(process: Process) {
    this._process$.next(process);
  }

  getInsideLawyerByProcess(data) {
    return data.LawyerProcess.filter((lp) => lp.Lawyer.userId).map((res) => ({
      name: res.Lawyer.name,
      id: res.Lawyer.id,
    }))[0];
  }

  getOutsideLawyerByProcess(data) {
    return data.LawyerProcess.filter((lp) => !lp.Lawyer.userId).map(
      (res) => res.Lawyer,
    )[0];
  }

  create(process: CreateProcess): Observable<CreateProcess> {
    return this._http.post<CreateProcess>(
      `${environment.apiURL}/processes`,
      process,
    );
  }

  update(id: number, process: any): Observable<Process> {
    return this._http.put<Process>(
      `${environment.apiURL}/processes/${id}`,
      process,
    );
  }

  reactivate(id: number, status: SendProcessStatus) {
    return this._http.put<Process>(
      `${environment.apiURL}/processes/reactivate/${id}`,
      {status},
    );
  }

  delete(id: number) {
    return this._http.delete<void>(`${environment.apiURL}/processes/${id}`);
  }

  findLawAreas(): Observable<LawArea[]> {
    return this._http.get<LawArea[]>(`${environment.apiURL}/processes/law_areas`);
  }

  findSubLawAreas(lawAreaId: number): Observable<LawSubArea[]> {
    return this._http.get<LawSubArea[]>(
      `${environment.apiURL}/processes/sub_law_areas/${lawAreaId}`,
    );
  }

  getProcessCount() {
    return this._http.get<number>(`${environment.apiURL}/count/processes`);
  }

  findObjects(): Observable<Object[]> {
    return this._http.get<Object[]>(`${environment.apiURL}/processes/objects`);
  }

  findSubObjects(objId: number): Observable<SubObject[]> {
    return this._http.get<SubObject[]>(
      `${environment.apiURL}/processes/sub_objects/${objId}`,
    );
  }

  findOriginByLawArea(lawAreaId: number): Observable<Origin[]> {
    return this._http.get<Origin[]>(
      `${environment.apiURL}/processes/origins/${lawAreaId}`,
    );
  }

  findOrigins(): Observable<Origin[]> {
    return this._http.get<Origin[]>(`${environment.apiURL}/processes/origins`);
  }

  findOrgans(originId: number): Observable<Organ[]> {
    return this._http.get<Organ[]>(`${environment.apiURL}/processes/organs/${originId}`);
  }

  findActiontypes(): Observable<ActionType[]> {
    return this._http.get<ActionType[]>(`${environment.apiURL}/processes/actions`);
  }

  findCountiesByUf(ufName: string): Observable<County[]> {
    return this._http.get<County[]>(`${environment.apiURL}/counties/${ufName}`);
  }

  findForumByCountyId(countyId: number): Observable<Forum[]> {
    return this._http.get<Forum[]>(`${environment.apiURL}/processes/forums/${countyId}`);
  }

  findPhases(): Observable<Phase[]> {
    return this._http.get<Phase[]>(`${environment.apiURL}/processes/phases`);
  }

  findClients(): Observable<Client[]> {
    return this._http.get<Client[]>(`${environment.apiURL}/processes/clients`);
  }

  findStakeholders(clientId: number): Observable<Stakeholder[]> {
    return this._http.get<Stakeholder[]>(
      `${environment.apiURL}/processes/stakeholders/${clientId}`,
    );
  }

  findSubjects(): Observable<Subject[]> {
    return this._http.get<Subject[]>(`${environment.apiURL}/processes/subjects`);
  }

  findStakeholdersPositions(): Observable<string[]> {
    return this._http.get<string[]>(`${environment.apiURL}/processes/positions`);
  }

  findAdverseStakeholdersByType(
    type: string,
  ): Observable<AdverseStakeholder[]> {
    return this._http.get<AdverseStakeholder[]>(
      `${environment.apiURL}/processes/adverse-stakeholders/${type}`,
    );
  }

  findAdverseStakeholdersByName(
    name: string,
  ): Observable<AdverseStakeholder[]> {
    let params = new HttpParams();
    params = params.append('name', name || '');
    return this._http.get<AdverseStakeholder[]>(
      `${environment.apiURL}/processes/adverse-stakeholders`,
      { params },
    );
  }

  findEletronicSystems(): Observable<EletronicSystem[]> {
    return this._http.get<EletronicSystem[]>(
      `${environment.apiURL}/processes/eletronic-systems`,
    );
  }
}
