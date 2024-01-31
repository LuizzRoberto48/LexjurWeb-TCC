import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { Core, LocalCore } from "../model/get-core";

export const CORE = "CORE"

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private _localCore$: BehaviorSubject<LocalCore> = new BehaviorSubject(null)
  $obsevableCore = this._localCore$.asObservable();

  constructor(private _http: HttpClient) {
    const storedObject = localStorage.getItem(CORE);
    if (storedObject) {
      this._localCore$.next(JSON.parse(storedObject));
    }
  }

  getAll() {
    return this._http.get(`${environment.apiURL}/cores`)
  }

  getById(id: number) {
    return this._http.get(`${environment.apiURL}/cores/${id}`)
  }

  getCoresByUser(): Observable<any[]> {
    return this._http.get<any[]>(`${environment.apiURL}/cores/user`)
  }

  create(core: Core): Observable<Core> {
    return this._http.post<Core>(`${environment.apiURL}/cores`, core);
  }

  update(id: number, core: any) {
    return this._http.put(`${environment.apiURL}/cores/${id}`, core)
  }

  remove(id: number){
    return this._http.delete(`${environment.apiURL}/cores/${id}`)
  }

  updateLocalStorage(core: LocalCore) {
    this._localCore$.next(core)
    localStorage.setItem(CORE, JSON.stringify(core))
  }

  get localCore(): LocalCore {
    return JSON.parse(localStorage.getItem(CORE))
  }

  romveLocalStorage() {
    localStorage.removeItem(CORE)
  }
}

