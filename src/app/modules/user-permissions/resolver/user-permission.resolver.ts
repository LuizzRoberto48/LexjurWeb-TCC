import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserPermissionsService } from '../user-permissions.service';

@Injectable({
  providedIn: 'any',
})
export class UserPermissionsResolver implements Resolve<any> {
  constructor(private userPermissions: UserPermissionsService) {}

  resolve(
    actroute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> {
    const id = actroute.params['id'];
    return this.userPermissions.findById(+id);
  }
}
