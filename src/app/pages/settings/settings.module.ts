import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings.routing.module';
import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { SettingsAccountComponent } from './account/account.component';
import { SettingsCoresComponent } from './cores/cores.component';
import { SettingsTeamComponent } from './team/team.component';
import { DetailsComponent } from '../details/details.component';
import { GlobalModule } from 'app/shared/global.module';
import { CoresFormComponent } from './cores/cores-form/cores-form.component';
import { CoreSheetModule } from 'app/modules/cores/core-sheet/core-sheet.module';



@NgModule({
  declarations: [
    SettingsComponent,
    SettingsAccountComponent,
    SettingsCoresComponent,
    DetailsComponent,
    CoresFormComponent,
    SettingsTeamComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    RouterModule,
    FuseDrawerModule,
    GlobalModule,
    CoreSheetModule,
  ]
})
export class SettingsModule { }
