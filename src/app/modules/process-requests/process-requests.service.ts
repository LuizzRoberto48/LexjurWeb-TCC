import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { ProcessRequestDTO } from './model/process-requests.model';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'any',
})
export class ProcessRequestsService extends BaseHttpService<any> {
  constructor(protected injector: Injector) {
    super('/process_requests', injector, ProcessRequestDTO.fromJson);
  }
  
  findRequestTypes() {
    return this.http.get<any[]>(`${environment.apiURL}/process_requests/types`);
    
  }
}
