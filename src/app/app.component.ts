import { Component } from '@angular/core';
import { AuthService } from './modules/auth/auth.service';
import { UserPermissionsService } from './modules/user-permissions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
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
    });
  }

}
