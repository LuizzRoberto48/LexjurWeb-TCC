import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/modules/user/user.service';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  constructor(
    private _activatedRoute: ActivatedRoute,
    private userService: UserService,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}
}
