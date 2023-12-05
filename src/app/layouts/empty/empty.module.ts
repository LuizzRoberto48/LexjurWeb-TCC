import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { GlobalModule } from 'app/shared/global.module';
import { EmptyLayoutComponent } from './empty.component';

@NgModule({
    declarations: [
        EmptyLayoutComponent
    ],
    imports     : [
        RouterModule,
        FuseLoadingBarModule,
        GlobalModule
    ],
    exports     : [
        EmptyLayoutComponent
    ]
})
export class EmptyLayoutModule
{
}
