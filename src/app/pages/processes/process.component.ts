import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/modules/auth/auth.service';
import { CoreSheedList } from 'app/modules/cores/core-sheet/core-sheet.component';
import { CoreService } from 'app/modules/cores/service/core.service';


@Component({
  selector: 'app-processes',
  templateUrl: './process.component.html',
})
export class ProcessComponent {
  constructor(
    protected activeRoute: ActivatedRoute,
    private coreService: CoreService,
    private _bottomSheet: MatBottomSheet,
    private auth: AuthService,
  ) {
    this.showBottomSheet();
  }

  ngOnInit() {}

  showBottomSheet() {
    this.auth.check().subscribe((isAuth) => {
      if (isAuth && !this.coreService.localCore)
        this._bottomSheet.open(CoreSheedList, { disableClose: true });
    });
  }
}
