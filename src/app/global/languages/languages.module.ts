import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { GlobalModule } from 'app/shared/global.module';
import { LanguagesComponent } from './languages.component';


@NgModule({
    declarations: [
        LanguagesComponent
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        GlobalModule
    ],
    exports     : [
        LanguagesComponent
    ]
})
export class LanguagesModule
{
}
