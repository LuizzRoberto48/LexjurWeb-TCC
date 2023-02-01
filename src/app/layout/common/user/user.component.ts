import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { TokenInfo } from 'app/core/auth/models/token-info';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'user'
})
export class UserComponent implements OnInit {

  static ngAcceptInputType_showAvatar: BooleanInput;

  @Input() showAvatar: boolean = true;
  
  constructor(
    private _router: Router,
    private _authService:AuthService
  ) {
  }
  
  get authUser():TokenInfo {
    return this._authService.authUser
  }
  
  ngOnInit(): void {

  }

  signOut(): void {
    this._authService.signOut()
    this._router.navigateByUrl('sign-in')
  }
}
