import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings.routing.module';
import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { MaterialModule } from 'app/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { SettingsAccountComponent } from './account/account.component';



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
    SharedModule,
  ]
})
export class SettingsModule { }
