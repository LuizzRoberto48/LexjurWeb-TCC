import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LawyerService } from '../lawyer.service';

@Injectable({
  providedIn: 'any',
})
export class LawyerDetailResolver implements Resolve<any> {
  constructor(private lawyerService: LawyerService) {}

  resolve(
    actroute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> {
    const id = actroute.params['id'];
    return this.lawyerService.findById(id);
  }
}
