import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { map, Observable } from "rxjs";
import { ActionType, AdverseStakeholder, Client, County, CreateProcess, Forum, GetProcess, LawArea, LawSubArea, Object, Organ, Origin, PersonType, Phase, Process, Stakeholder, Subject, SubObject, Ufs } from "./models/process.model";

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  constructor(private _http: HttpClient) { }

  getProcessById(id: number): Observable<Process> {
    return this._http.get<Process>(`${environment.apiURL}/processes/${id}`)
  }

  getProcessByCore(coreId: number): Observable<GetProcess[]> {
    return this._http.get<Process[]>(`${environment.apiURL}/processes/core/${coreId}`).pipe(
      map(res => res.map((data: any) =>
        ({ ...data, subject: data.Subject.name, lawyer: this.getInsideLawyerByProcess(data).name })
      ))
    )
  }

  getInsideLawyerByProcess(data) {
    return data.LawyerProcess.filter(lp => lp.Lawyer.userId).map(res => ({ name: res.Lawyer.person.name, id: res.Lawyer.id }))[0]
  }

  getOutsideLawyerByProcess(data) {
    return data.LawyerProcess.filter(lp => !lp.Lawyer.userId).map(res => ({ lawyer: res.Lawyer }))[0]
  }

  create(process: CreateProcess): Observable<CreateProcess> {
    return this._http.post<CreateProcess>(`${environment.apiURL}/processes`, process)
  }

  update(id: number, process: any): Observable<Process> {
    return this._http.put<Process>(`${environment.apiURL}/processes/${id}`, process)
  }

  findLawAreas(): Observable<LawArea[]> {
    return this._http.get<LawArea[]>(`${environment.apiURL}/law_areas`)
  }

  findSubLawAreas(lawAreaId: number): Observable<LawSubArea[]> {
    return this._http.get<LawSubArea[]>(`${environment.apiURL}/sub_law_areas/${lawAreaId}`)
  }

  findObjects(): Observable<Object[]> {
    return this._http.get<Object[]>(`${environment.apiURL}/objects`)
  }

  findSubObjects(objId: number): Observable<SubObject[]> {
    return this._http.get<SubObject[]>(`${environment.apiURL}/sub_objects/${objId}`)
  }

  findOrigins(lawAreaId: number): Observable<Origin[]> {
    return this._http.get<Origin[]>(`${environment.apiURL}/origins/${lawAreaId}`)
  }

  findOrgans(originId: number): Observable<Organ[]> {
    return this._http.get<Organ[]>(`${environment.apiURL}/organs/${originId}`)
  }

  findActiontypes(): Observable<ActionType[]> {
    return this._http.get<ActionType[]>(`${environment.apiURL}/actions`)
  }

  findUfs(): Observable<Ufs[]> {
    return this._http.get<Ufs[]>(`${environment.apiURL}/ufs`)
  }

  findCountiesByUf(ufId: number): Observable<County[]> {
    return this._http.get<County[]>(`${environment.apiURL}/counties/${ufId}`)
  }

  findForumByCountyId(countyId: number): Observable<Forum[]> {
    return this._http.get<Forum[]>(`${environment.apiURL}/forums/${countyId}`)
  }

  findPhases(): Observable<Phase[]> {
    return this._http.get<Phase[]>(`${environment.apiURL}/phases`)
  }

  findClients(): Observable<Client[]> {
    return this._http.get<Client[]>(`${environment.apiURL}/clients`)
  }

  findStakeholders(clientId: number): Observable<Stakeholder[]> {
    return this._http.get<Stakeholder[]>(`${environment.apiURL}/stakeholders/${clientId}`)
  }

  findSubjects(): Observable<Subject[]> {
    return this._http.get<Subject[]>(`${environment.apiURL}/subjects`)
  }

  findStakeholdersPositions(): Observable<string[]> {
    return this._http.get<string[]>(`${environment.apiURL}/positions`)
  }

  findAdverseStakeholdersByType(type: string): Observable<AdverseStakeholder[]> {
    return this._http.get<AdverseStakeholder[]>(`${environment.apiURL}/adverse-stakeholders/${type}`)
  }

  
}