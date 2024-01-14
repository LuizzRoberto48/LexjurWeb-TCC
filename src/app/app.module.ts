import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { CoreModule } from 'app/modules/core.module';
import { appConfig } from 'app/global/config/app.config';
import { LuxonModule } from 'luxon-angular';

import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { CommonModule } from '@angular/common';
import { GlobalModule } from './shared/global.module';
import { LayoutModule } from './layouts/layout.module';

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, routerConfig),
    FuseModule,
    FuseConfigModule.forRoot(appConfig),
    CoreModule,
    LayoutModule,
    LuxonModule,
    GlobalModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
