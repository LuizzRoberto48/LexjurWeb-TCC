import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ProcessGuaranteeService } from '../process-guarantee.service';

@Injectable({
  providedIn: 'any',
})
export class GuaranteeResolver implements Resolve<any> {
  constructor(private guaranteeService: ProcessGuaranteeService) {}

  resolve(
    actroute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> {
    const id = actroute.params['id'];
    return this.guaranteeService.findById(id);
  }
}
