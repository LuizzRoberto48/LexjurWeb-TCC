import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { BasicLawyer, CreateLawyer, GetLawyer, LawyerFields, UpdateLawyer } from './model/lawyer.model';

@Injectable({
  providedIn: 'root',
})
export class LawyerService {
  constructor(private _http: HttpClient) {}

  findAdverseLawyerByFilter(fields: LawyerFields): Observable<GetLawyer[]> {
    const params = this.httpParams(fields);
    return this._http.get<GetLawyer[]>(
      `${environment.apiURL}/lawyers/outside`,
      { params },
    );
  }

  findInsideLaywerByFilter(
    coreId: number,
    fields: LawyerFields,
  ): Observable<GetLawyer[]> {
    const params = this.httpParams(fields);
    return this._http.get<GetLawyer[]>(
      `${environment.apiURL}/lawyers/inside/${coreId}`,
      { params },
    );
  }

  private httpParams(params: LawyerFields): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(function (key) {
      httpParams = httpParams.append(key, params[key]);
    });
    return httpParams;
  }

  findLawyersByCore(coreId: number) {
    return this._http.get<BasicLawyer[]>(
      `${environment.apiURL}/lawyers/core/${coreId}`,
    );
  }

  update(id: number, info: CreateLawyer){
    return this._http.put(
      `${environment.apiURL}/lawyers/${id}`, info
    );
  }
}
