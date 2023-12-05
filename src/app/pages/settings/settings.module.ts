import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings.routing.module';
import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { SettingsAccountComponent } from '../account/account.component';
import { GlobalModule } from 'app/shared/global.module';



@NgModule({
  declarations: [
    SettingsComponent,
    SettingsAccountComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    RouterModule,
    FuseDrawerModule,
    GlobalModule,
  ]
})
export class SettingsModule { }
