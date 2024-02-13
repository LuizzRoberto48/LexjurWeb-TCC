import { Component } from '@angular/core';
import { PERMISSIONID } from 'app/modules/user/profile/profile-helper';
import { UserService } from 'app/modules/user/user.service';

@Component({
  selector: 'app-perimissions',
  templateUrl: './perimissions.component.html',
})
export class UserPermissionsComponent {
  infoPage;
  constructor(private userService: UserService) {
    this.infoPage = this.userService.panels.find(
      (info) => info.id == PERMISSIONID,
    );
  }
}
