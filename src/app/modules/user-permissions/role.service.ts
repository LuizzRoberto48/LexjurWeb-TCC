import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { PermissionFeature } from './features.model';
import { PermissionRole } from './role.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionRoleService extends BaseHttpService<any> {
  constructor(protected injector: Injector) {
    super('/permission_roles', injector, PermissionRole.fromJson);
  }
}
