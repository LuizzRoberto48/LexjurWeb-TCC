import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, map } from 'rxjs';
import {
  CreateResource,
  FormResource,
  GetResource,
} from './model/resource.model';
import { FormGroup } from '@angular/forms';

export const CORE = 'CORE';

@Injectable({
  providedIn: 'any',
})
export class ResourceService {
  constructor(private http: HttpClient) {}

  create(data: CreateResource): Observable<GetResource> {
    return this.http.post<GetResource>(`${environment.apiURL}/resources`, data);
  }

  getById(id: number): Observable<GetResource> {
    return this.http.get<GetResource>(`${environment.apiURL}/resources/${id}`);
  }

  update(data: CreateResource): Observable<GetResource> {
    return this.http.put<GetResource>(
      `${environment.apiURL}/resources/${data.id}`,
      data,
    );
  }

  remove(id: number): Observable<any> {
    return this.http.delete<GetResource>(
      `${environment.apiURL}/resources/${id}`,
    );
  }

  getResourcesByProcess(processId: number) {
    let params = new HttpParams();
    params = params.append('processId', processId);
    return this.http
      .get(`${environment.apiURL}/resources`, { params })
      .pipe(map((resources: any[]) => this.formatReqToResource(resources)));
  }

  formatReqToResource(list: any[]): GetResource[] {
    return list.map((l) => ({
      id: l.id,
      number: l.number,
      origin: l.organ.Origin.name,
      uf: l.forum.County.uf,
      county: l.forum.County.name,
      organ: l.organ.name,
      forum: l.forum.name,
      instance: l.instance,
      status: l.status,
      resourceType: l.type,
    }));
  }

  formToObj(form, processId: number): CreateResource {
    return {
      id: form?.id,
      forumId: form.forum,
      number: form.number,
      organId: form.organ,
      processId,
      instance: form.instance,
      type: form.resourceType,
    };
  }

  objToForm(form: FormGroup, obj: any): FormGroup<any> {
    const resource: Partial<FormResource> = {
      id: obj.id,
      instance: obj.instance,
      origin: obj.organ.originId,
      uf: obj.forum.County.uf,
      county: obj.forum.countyId,
      number: obj.number,
      organ: obj.organId,
      resourceType: obj.type,
      forum: obj.forumId,
    };
    console.log(resource);
    form.patchValue(resource);
    return form;
  }
}
