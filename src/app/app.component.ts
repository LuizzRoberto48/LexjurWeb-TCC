import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CoreSheedList } from './modules/cores/core-sheet/core-sheet.component';
import { CoreService } from './modules/cores/service/core.service';
import { AuthService } from './modules/auth/auth.service';
import { UserPermissionsService } from './modules/user-permissions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private coreService: CoreService,
    private _bottomSheet: MatBottomSheet,
    private auth: AuthService,
    private userPermission:UserPermissionsService
  ) {
    this.loggeId();
    
  }

  loggeId() {
    this.auth.check().subscribe((isAuth) => {
      /* quando refresh na tela, é adicionado as permissões novamente */
      if(isAuth)
        this.userPermission.findFeatsAndRolesByCurrentUser();

      if (isAuth && !this.coreService.localCore)
        this._bottomSheet.open(CoreSheedList, { disableClose: true });
    });
  }

}
