import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { LocalCore } from "../model/get-core";

export const CORE = "CORE"

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private _localCore$: BehaviorSubject<LocalCore> = new BehaviorSubject(null)
  $obsevableCore = this._localCore$.asObservable();

  constructor(private _http: HttpClient) {
    // Retrieve the object from localStorage and set it as the initial value of the BehaviorSubject
    const storedObject = localStorage.getItem(CORE);
    if (storedObject) {
      this._localCore$.next(JSON.parse(storedObject));
    }
  }

  getById(id: number) {
    this._http.get(`${environment.apiURL}/cores/:${id}`)
  }

  getCoresByUser(): Observable<any[]> {
    return this._http.get<any[]>(`${environment.apiURL}/cores/user`)
  }

  create(core: any) {
    this._http.post(`${environment.apiURL}/cores`, core)
  }

  update(id: number, core: any) {
    this._http.put(`${environment.apiURL}/cores/${id}`, core)
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