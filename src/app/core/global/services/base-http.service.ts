import { Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResourceModel, ParamsModel } from '../models/base-http.model';
import { Page, PageRequest } from '../models/pageable.model';
import { environment } from 'environments/environment';

export abstract class BaseHttpService<T extends BaseResourceModel> {
  private _httpParams: HttpParams = new HttpParams();
  protected http: HttpClient;
  private path: string = '';
  constructor(
    protected apiPath: string,
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T,
  ) {
    this.path = `${environment.apiURL}${apiPath}`;
    this.http = injector.get(HttpClient);
  }

  getHttpParams(params?: Array<ParamsModel>): HttpParams {
    let paramsObj = new HttpParams();
    if (!params || params.length === 0) return paramsObj;
    params.forEach((element) => {
      paramsObj = paramsObj.set(element.name, element.value);
    });
    return paramsObj;
  }

  removeHttpParams() {
    let params = new HttpParams();
    this._httpParams = params;
  }

  findAll(params?:Array<ParamsModel>): Observable<T[]> {
    this.getHttpParams(params)
    return this.http
      .get<T[]>(this.path, { params: this.getHttpParams(params) })
      .pipe(map(this.jsonDataToResources.bind(this)));
  }

  findAllPaginated(filter?: string): Observable<PageRequest> {
    return this.http.get<PageRequest>(`${this.path}?${filter || ''}`, {
      params: this._httpParams,
    });
  }

  findById(id: number): Observable<T> {
    const url = `${this.path}/${id}`;
    return this.http
      .get(url, { params: this._httpParams })
      .pipe(map(this.jsonDataToResource.bind(this)));
  }

  create(resource: T): Observable<T> {
    return this.http
      .post(this.path, resource)
      .pipe(map(this.jsonDataToResource.bind(this)));
  }

  update(resource: T): Observable<T> {
    const url = `${this.path}/${resource.id}`;
    return this.http.put(url, resource).pipe(map(() => resource));
  }

  delete(id: number): Observable<any> {
    const url = `${this.path}/${id}`;
    return this.http.delete(url).pipe(map(() => null));
  }

  // PROTECTED METHODS
  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach((element) => {
      return resources.push(this.jsonDataToResourceFn(element));
    });
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }
}
