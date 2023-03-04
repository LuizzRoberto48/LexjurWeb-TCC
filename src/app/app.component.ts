import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CoreSheedList } from './core/cores/core-sheet/core-sheet.component';
import { CoreService } from './core/cores/service/core.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private coreService: CoreService, private _bottomSheet: MatBottomSheet) {
        if (!this.coreService.localCore) {
            this._bottomSheet.open(CoreSheedList, { disableClose: true })
        }
    }
}
