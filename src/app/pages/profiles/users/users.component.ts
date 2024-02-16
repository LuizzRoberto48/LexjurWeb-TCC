import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePanel } from 'app/modules/user/profile/models/panel.model';
import { USERID } from 'app/modules/user/profile/profile-helper';
import { UserService } from 'app/modules/user/user.service';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
})
export class UsersComponent {
  infoPage: ProfilePanel;
  isOpened = false;
  constructor(
    private userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.infoPage = this.userService.panels.find((info) => info.id == USERID);
  }

  editUser(user:any): void {
    this._router.navigate(['./edit', 1], {
      relativeTo: this._activatedRoute,
    });
    this._changeDetectorRef.markForCheck();
  }
}
