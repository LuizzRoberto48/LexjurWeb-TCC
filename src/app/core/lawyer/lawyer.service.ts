import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { GetLawyer, LawyerFields } from "./model/lawyer.model";

@Injectable({
  providedIn: 'any'
})
export class LawyerService {

  constructor(private _http: HttpClient) { }

  findAdverseLawyerByFilter(fields: LawyerFields): Observable<GetLawyer[]> {
    const params = this.httpParams(fields)
    return this._http.get<GetLawyer[]>(`${environment.apiURL}/lawyers/outside`, { params })
  }

  findInsideLaywerByFilter(coreId:number,fields: LawyerFields): Observable<GetLawyer[]> {
    const params = this.httpParams(fields)
    return this._http.get<GetLawyer[]>(`${environment.apiURL}/lawyers/inside/${coreId}`, { params })
  }

  private httpParams(params: LawyerFields): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(function (key) {
      httpParams = httpParams.append(key, params[key]);
    });
    return httpParams;
  }

}