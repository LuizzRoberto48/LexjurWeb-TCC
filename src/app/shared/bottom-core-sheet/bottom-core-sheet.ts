import {Component} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';


@Component({
  selector: 'bottom-core-sheet',
  templateUrl: 'bottom-core-sheet.html',
})
export class BottomSheetCoreList {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetCoreList>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}