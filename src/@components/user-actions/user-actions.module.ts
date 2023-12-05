import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CoreSheetModule } from 'app/modules/cores/core-sheet/core-sheet.module';

import { GlobalModule } from 'app/shared/global.module';
import { UserActionsComponent } from './user-actions.component';

@NgModule({
    declarations: [
        UserActionsComponent
    ],
    imports     : [
        MatMenuModule,
        CoreSheetModule,
        RouterModule,
        GlobalModule
    ],
    exports     : [
        UserActionsComponent
    ]
})
export class UserActionsModule
{
}
