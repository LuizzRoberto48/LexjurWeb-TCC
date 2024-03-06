import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserPermissionsService } from 'app/modules/user-permissions';
import { RoleFeatureData } from 'app/modules/user-permissions/user-permissions.service';
import { Subscription, tap } from 'rxjs';

const FULL = 'FULL';

enum ROLES {
  READ = 'READ',
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  FULL = 'FULLACCESS',
  CANCEL = 'CANCEL',
}

@Directive({ selector: '[hasPermission]' })
export class HasPermission {
  private permissionCheckSubscription: Subscription;
  private features: Array<string>;
  private roles: Array<string>;

  @Input('hasPermission') set permissions(values: string | Array<string>) {
    if (!Array.isArray(values)) {
      this.roles = [values.split('-')[0].toUpperCase()];
      this.features = [values.split('-')[1].toUpperCase()];
      this.checkPermissions();
      return;
    }
    this.roles = values.map((v) => v.split('-')[0].toUpperCase());
    this.features = values.map((v) => v.split('-')[1].toUpperCase());

    this.checkPermissions();
  }

  constructor(
    private userPermission: UserPermissionsService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {}

  checkPermissions() {
    this.userPermission.$obsevableRoleAndFeature.subscribe({
      next: (data) => {
        if (!data) return;
        if (data.isAdmin) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          return;
        } else if (this.hasFullPermissions(data.permissionFeatures)) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          return;
        } else if (this.hasFeaturePermissions(data.permissionFeatures)) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          return;
        }
      },
    });
  }

  private hasFullPermissions(permissionFeatures: any): boolean {
    return permissionFeatures.some(
      (pf: RoleFeatureData) =>
        pf.feature.name.toUpperCase() == FULL &&
        (pf.role.name.toUpperCase() == ROLES.FULL ||
          this.roles.some((role) => role == pf.role.name.toUpperCase())),
    );
  }

  private hasFeaturePermissions(permissions: any): boolean {
    return permissions.some(
      (pf: RoleFeatureData) =>
        this.features.some((f) => f === pf.feature.name.toUpperCase()) &&
        this.roles.some((r) => r === pf.role.name.toUpperCase()),
    );
  }

  ngOnDestroy() {
    this.userPermission.destroySubs();

    if (this.permissionCheckSubscription)
      this.permissionCheckSubscription.unsubscribe();
  }
}
