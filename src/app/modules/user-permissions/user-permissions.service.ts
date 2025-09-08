import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { UserPermission } from './user-permission.model';
import { environment } from 'environments/environment';
import { BehaviorSubject, Subject, map, takeUntil } from 'rxjs';

export interface UserRoleFeature {
  permissionFeatures: RoleFeatureData[];
  isAdmin: boolean;
}
export interface RoleFeatureData {
  feature: { name: string };
  role: { name: string };
}
@Injectable({
  providedIn: 'root',
})
export class UserPermissionsService extends BaseHttpService<any> {
 
  private rolesAndFeaturesSubject$: BehaviorSubject<UserRoleFeature> = new BehaviorSubject(null)
  $obsevableRoleAndFeature = this.rolesAndFeaturesSubject$.asObservable();
  private destroy$ = new Subject<void>();
  constructor(protected injector: Injector) {
    super('/user_permissions', injector, UserPermission.fromJson);
    //this.findFeatsAndRolesByCurrentUser();
  }

  findFeatsAndRolesByCurrentUser() {
    return this.http
      .get<UserRoleFeature>(
        `${environment.apiURL}/user_permissions/roles_and_features`,
      )
      .pipe(
        map(({ isAdmin, permissionFeatures }: UserRoleFeature) => ({
          permissionFeatures: permissionFeatures.map((r) => ({
            feature: { name: r.feature.name },
            role: { name: r.role.name },
          })),
          isAdmin,
        })),
        takeUntil(this.destroy$),
      ).subscribe({
        next:(data)=> {
          this.rolesAndFeaturesSubject$.next(data)
        }
      });
  }

  destroySubs() {
    this.destroy$.next(); 
    this.destroy$.complete();
  }
}
