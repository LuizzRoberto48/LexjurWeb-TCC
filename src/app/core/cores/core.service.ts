import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private _http: HttpClient) { }

  getById(id: number) {
    this._http.get(`${environment.apiURL}/cores/:${id}`)
  }

  create(core: any) {
    this._http.post(`${environment.apiURL}/cores`, core)
  }

  update(id: number, core: any) {
    this._http.put(`${environment.apiURL}/cores/${id}`, core)
  }
}