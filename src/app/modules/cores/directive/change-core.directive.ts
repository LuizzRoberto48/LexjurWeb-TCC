import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CoreSheedList } from '../core-sheet/core-sheet.component';
@Directive({
  selector: '[changeCore]'
})
export class ChangeCoreDirective {

  constructor(private _bottomSheet: MatBottomSheet) { }

  @HostListener('click') onClick() {
    return this.changeCore()
  }

  changeCore() {
    this._bottomSheet.open(CoreSheedList);
  }
}