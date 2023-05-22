import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs';
import { GetResource } from './model/resource.model';

export const CORE = 'CORE';

@Injectable({
  providedIn: 'any',
})
export class ResourceService {
  constructor(private http: HttpClient) {}

  getResourceByProcess(processId: number) {
    let params = new HttpParams();
    params = params.append('processId', processId);
    return this.http.get(`${environment.apiURL}/resources`, { params }).pipe(
      map((resources: any[]) => {
        return this.formatReqToResource(resources);
      }),
    );
  }

  formatReqToResource(list: any[]) {
    return list.map((l) => ({
      number: l.number,
      origin: l.origin.name,
      uf: l.forum.County.UF.name,
      county: l.forum.County.name,
      forum: l.forum.name,
      instance: l.instance,
      status: l.status,
      resourceType: l.type,
    }));
  }
}
