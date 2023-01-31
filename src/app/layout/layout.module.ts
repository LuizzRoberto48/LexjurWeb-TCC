import { NgModule } from '@angular/core';
import { LayoutComponent } from 'app/layout/layout.component';


import { SettingsModule } from 'app/layout/common/settings/settings.module';
import { SharedModule } from 'app/shared/shared.module';

import { ClassyLayoutModule } from './layouts/classy/classy.module';
import { ClassicLayoutModule } from './layouts/classic/classic.module';
import { EmptyLayoutModule } from './layouts/empty/empty.module';

const layoutModules = [
    ClassicLayoutModule,
    ClassyLayoutModule,
    EmptyLayoutModule
];

@NgModule({
    declarations: [
        LayoutComponent
    ],
    imports     : [
        SharedModule,
        SettingsModule,
        ...layoutModules
    ],
    exports     : [
        LayoutComponent,
        ...layoutModules
    ]
})
export class LayoutModule {}
