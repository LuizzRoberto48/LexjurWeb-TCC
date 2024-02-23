import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { UserPermission } from './user-permission.model';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionsService extends BaseHttpService<any> {
  
  
  constructor(protected injector: Injector) {
    super('/user_permissions', injector, UserPermission.fromJson);
  }

  
}
