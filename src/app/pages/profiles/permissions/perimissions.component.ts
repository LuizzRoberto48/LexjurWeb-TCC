import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GetUserPermission } from 'app/modules/user-permissions/user-permission.model';
import { UserPermissionsService } from 'app/modules/user-permissions/user-permissions.service';
import { PERMISSIONID } from 'app/modules/user/profile/profile-helper';
import { UserService } from 'app/modules/user/user.service';

@Component({
  selector: 'app-perimissions',
  templateUrl: './perimissions.component.html',
})
export class UserPermissionsComponent {
  isOpened = false;
  infoPage;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private userService: UserService,
    private userPermission: UserPermissionsService,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.infoPage = this.userService.panels.find(
      (info) => info.id == PERMISSIONID,
    );
  }

  newPermission(): void {
    this._router.navigate(['./new'], {
      relativeTo: this._activatedRoute,
    });
  }
}
