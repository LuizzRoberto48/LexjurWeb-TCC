import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, of } from "rxjs";
import { LocalCore } from "../model/get-core";

export const CORE = "CORE"

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private _http: HttpClient) { }

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

  addLocalStorage(core: LocalCore) {
    localStorage.setItem(CORE, JSON.stringify(core))
  }

  get $localCore():Observable<LocalCore> {
    return of(JSON.parse(localStorage.getItem(CORE)))
  }

  romveLocalStorage() {
    localStorage.removeItem(CORE)
  }
}