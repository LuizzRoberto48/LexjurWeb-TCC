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
  Stakeholder,
  Subject,
  SubObject,
} from './models/process.model';
import { Paginator } from 'app/global/paginator/public-api';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private _process$: BehaviorSubject<Process> = new BehaviorSubject(null);
  $obsevableProcess = this._process$.asObservable();
  constructor(private _http: HttpClient) {}

  getProcessById(id: number): Observable<Process> {
    return this._http.get<Process>(`${environment.apiURL}/processes/${id}`);
  }

  getProcessByCore(
    coreId: number,
    paginator: Paginator,
  ): Observable<GetProcessPageable> {
    const params = this.httpParams(paginator);
    return this._http
      .get<GetProcessPageable>(
        `${environment.apiURL}/core/${coreId}/processes`,
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

  set memoryProcess(process: Process) {
    this._process$.next(process);
  }

  private httpParams(params: Paginator): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(function (key) {
      httpParams = httpParams.append(key, params[key]);
    });
    return httpParams;
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

  findLawAreas(): Observable<LawArea[]> {
    return this._http.get<LawArea[]>(`${environment.apiURL}/law_areas`);
  }

  findSubLawAreas(lawAreaId: number): Observable<LawSubArea[]> {
    return this._http.get<LawSubArea[]>(
      `${environment.apiURL}/sub_law_areas/${lawAreaId}`,
    );
  }

  getProcessCount() {
    return this._http.get<number>(`${environment.apiURL}/count/processes`);
  }

  findObjects(): Observable<Object[]> {
    return this._http.get<Object[]>(`${environment.apiURL}/objects`);
  }

  findSubObjects(objId: number): Observable<SubObject[]> {
    return this._http.get<SubObject[]>(
      `${environment.apiURL}/sub_objects/${objId}`,
    );
  }

  findOriginByLawArea(lawAreaId: number): Observable<Origin[]> {
    return this._http.get<Origin[]>(
      `${environment.apiURL}/origins/${lawAreaId}`,
    );
  }

  findOrigins(): Observable<Origin[]> {
    return this._http.get<Origin[]>(`${environment.apiURL}/origins`);
  }

  findOrgans(originId: number): Observable<Organ[]> {
    return this._http.get<Organ[]>(`${environment.apiURL}/organs/${originId}`);
  }

  findActiontypes(): Observable<ActionType[]> {
    return this._http.get<ActionType[]>(`${environment.apiURL}/actions`);
  }

  findCountiesByUf(ufName: string): Observable<County[]> {
    return this._http.get<County[]>(`${environment.apiURL}/counties/${ufName}`);
  }

  findForumByCountyId(countyId: number): Observable<Forum[]> {
    return this._http.get<Forum[]>(`${environment.apiURL}/forums/${countyId}`);
  }

  findPhases(): Observable<Phase[]> {
    return this._http.get<Phase[]>(`${environment.apiURL}/phases`);
  }

  findClients(): Observable<Client[]> {
    return this._http.get<Client[]>(`${environment.apiURL}/clients`);
  }

  findStakeholders(clientId: number): Observable<Stakeholder[]> {
    return this._http.get<Stakeholder[]>(
      `${environment.apiURL}/stakeholders/${clientId}`,
    );
  }

  findSubjects(): Observable<Subject[]> {
    return this._http.get<Subject[]>(`${environment.apiURL}/subjects`);
  }

  findStakeholdersPositions(): Observable<string[]> {
    return this._http.get<string[]>(`${environment.apiURL}/positions`);
  }

  findAdverseStakeholdersByType(
    type: string,
  ): Observable<AdverseStakeholder[]> {
    return this._http.get<AdverseStakeholder[]>(
      `${environment.apiURL}/adverse-stakeholders/${type}`,
    );
  }

  findAdverseStakeholdersByName(
    name: string,
  ): Observable<AdverseStakeholder[]> {
    let params = new HttpParams();
    params = params.append('name', name || '');
    return this._http.get<AdverseStakeholder[]>(
      `${environment.apiURL}/adverse-stakeholders`,
      { params },
    );
  }

  findEletronicSystems(): Observable<EletronicSystem[]> {
    return this._http.get<EletronicSystem[]>(
      `${environment.apiURL}/eletronic-systems`,
    );
  }
}
