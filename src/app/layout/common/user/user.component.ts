import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { AuthService } from 'app/core/auth/auth.service';
import { TokenInfo } from 'app/core/auth/models/token-info';
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { CoreSheedList } from 'app/core/cores/core-sheet/core-sheet.component';
import { CoreService } from 'app/core/cores/service/core.service';
import { LocalCore } from 'app/core/cores/model/get-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'user'
})
export class UserComponent implements OnInit {

  static ngAcceptInputType_showAvatar: BooleanInput;
  coreName: string
  @Input() showAvatar: boolean = true;
  $subsChangedCore: Subscription = new Subscription()

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _bottomSheet: MatBottomSheet,
    private coreService: CoreService
  ) {
  }

  get authUser(): TokenInfo {
    return this._authService.authUser
  }


  ngOnInit(): void {
    this.$subsChangedCore = this.coreService.$obsevableCore.subscribe(res => {
      this.coreName = res?.name
    })
  }

  changeCore() {
    this._bottomSheet.open(CoreSheedList);
  }


  signOut(): void {
    this._authService.signOut()
    this._router.navigateByUrl('sign-in')
  }

  ngOnDestroy() {
    this.$subsChangedCore.unsubscribe()
  }
}
