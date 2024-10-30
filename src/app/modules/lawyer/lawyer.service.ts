import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, map } from 'rxjs';
import {
  BasicLawyer,
  CreateLawyer,
  GetLawyer,
  GetLawyerPageable,
  LawyerFields,
} from './model/lawyer.model';
import { Paginator } from 'app/global/paginator/public-api';

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

  findAllInsideLawyers() {
    return this._http.get<GetLawyer[]>(
      `${environment.apiURL}/lawyers/inside_lawyers`,
    );
  }

  findAllInsideLawyersByCore(coreId:number) {
    return this._http.get<GetLawyer[]>(
      `${environment.apiURL}/lawyers/inside_lawyers/${coreId}`,
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

  private httpParams(...params: any[]): HttpParams {
    const combinedParams = Object.assign({}, ...params);
    let httpParams = new HttpParams();
    Object.keys(combinedParams).forEach((key) => {
      if (combinedParams[key] != null) {
        httpParams = httpParams.append(key, combinedParams[key]);
      }
    });
    return httpParams;
  }

  findLawyersByCore(coreId: number) {
    return this._http.get<BasicLawyer[]>(
      `${environment.apiURL}/lawyers/core/${coreId}`,
    );
  }

  update(id: number, info: CreateLawyer) {
    return this._http.put(`${environment.apiURL}/lawyers/${id}`, info);
  }

  updateProcesses(newLawyerId:number, body:{processIds:number[]}) {
    return this._http.put(`${environment.apiURL}/lawyers/processes/${newLawyerId}`, body);
  }

  updateCurrentLawyer(info: CreateLawyer) {
    return this._http.put(`${environment.apiURL}/lawyers/current`, info);
  }

  findAllInsideLawyersPaginated(
    paginator: Paginator,
    fields: LawyerFields = {},
  ): Observable<GetLawyerPageable> {
    const params = this.httpParams(paginator, fields);
    return this._http
      .get<GetLawyerPageable>(`${environment.apiURL}/lawyers/inside`, {
        params,
      })
      .pipe(
        map((res) => ({ lawyers: res.lawyers, totalItems: res.totalItems })),
      );
  }

  findByUserId(id: number) {
    return this._http.get(`${environment.apiURL}/lawyers/user/${id}`);
  }

  findById(id: number) {
    return this._http.get(`${environment.apiURL}/lawyers/${id}`);
  }

  create(lawyer: CreateLawyer) {
    return this._http.post(`${environment.apiURL}/lawyers`, lawyer);
  }
}
