import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CoreSheetModule } from 'app/core/cores/core-sheet/core-sheet.module';
import { UserComponent } from 'app/layout/common/user/user.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        UserComponent
    ],
    imports     : [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        CoreSheetModule,
        RouterModule
    ],
    exports     : [
        UserComponent
    ]
})
export class UserModule
{
}
