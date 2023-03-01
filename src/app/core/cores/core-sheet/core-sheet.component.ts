import { Component } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { Core } from '../model/get-core';
import { CoreService } from '../service/core.service';


@Component({
  selector: 'bottom-core-sheet',
  templateUrl: 'core-sheet.component.html',
})
export class CoreSheedList {
  $coreList: Observable<any[]>
  constructor(private _bottomSheetRef: MatBottomSheetRef<CoreSheedList>, private coreService: CoreService) { }

  ngOnInit() {
    this.$coreList = this.coreService.getCoresByUser();

  }

  openLink(core: Core): void {
    const { id, name } = core
    this.coreService.addLocalStorage({ id, name })
    this._bottomSheetRef.dismiss();
  }



}