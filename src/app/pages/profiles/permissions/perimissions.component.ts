import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.infoPage = this.userService.panels.find(
      (info) => info.id == PERMISSIONID,
    );
  }

  newPermission(): void {
    // Go to the new contact
    this._router.navigate(['./new'], {
      relativeTo: this._activatedRoute,
    });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }
}
