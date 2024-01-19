import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { ProcessPartsDTO } from './dto/process-parts.dto';
@Injectable({
  providedIn: 'any',
})
export class ProcessPartsService extends BaseHttpService<any> {
  constructor(protected injector: Injector) {
    super('/process_parts', injector, ProcessPartsDTO.fromJson);
  }
}
