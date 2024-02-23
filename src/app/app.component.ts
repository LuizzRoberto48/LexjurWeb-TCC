import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CoreSheedList } from './modules/cores/core-sheet/core-sheet.component';
import { CoreService } from './modules/cores/service/core.service';
import { AuthService } from './modules/auth/auth.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private coreService: CoreService, private _bottomSheet: MatBottomSheet, private auth: AuthService) {
    this.auth.check().subscribe(isAuth => {
      if (isAuth && !this.coreService.localCore)
        this._bottomSheet.open(CoreSheedList, { disableClose: true })
    })
    
  }
}
