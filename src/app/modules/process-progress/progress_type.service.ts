import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { ProcessProgressTypes } from './models/progress_types.model';

@Injectable({
  providedIn: 'any',
})
export class ProcessProgressTypeService extends BaseHttpService<any> {
  constructor(protected injector: Injector) {
    super('/process_progress_types', injector, ProcessProgressTypes.fromJson);
  }
}
