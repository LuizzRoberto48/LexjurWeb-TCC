import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { PermissionFeature } from './features.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionFeatureService extends BaseHttpService<any> {
  constructor(protected injector: Injector) {
    super('/permission_features', injector, PermissionFeature.fromJson);
  }
}
