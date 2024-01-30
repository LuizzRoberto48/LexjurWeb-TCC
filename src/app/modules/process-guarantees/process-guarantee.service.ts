import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { environment } from 'environments/environment';
import { ProcessGuarantee } from './model/guarantees.model';

@Injectable({
  providedIn: 'any',
})
export class ProcessGuaranteeService extends BaseHttpService<any> {
  constructor(protected injector: Injector) {
    super('/process_guarantees', injector, ProcessGuarantee.fromJson);
  }

  findGuaranteeTypes() {
    return this.http.get<any[]>(`${environment.apiURL}/process_guarantee_types`);
  }
}
