import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DeadlineTrackerService } from '../deadline-tracker.service';

@Injectable({
  providedIn: 'any',
})
export class DeadlineFormResolver implements Resolve<any> {
  constructor(private deadlineTrackerService: DeadlineTrackerService) {}

  resolve(
    actroute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> {
    const id = actroute.params['id'];
    return this.deadlineTrackerService.findById(id);
  }
}
