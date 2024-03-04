import { LOCALE_ID, NgModule } from '@angular/core';
import { LawyerComponent } from './lawyer.component';
import { RouterModule } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { GlobalModule } from 'app/shared/global.module';
import { HeaderContentModule } from '@components/header-content/header-content.module';
import localePt from '@angular/common/locales/pt';
import { routes } from './lawyer.routing';
import { PermissionsListComponent } from './permissions/list/permissions-list.component';
import { LawyerPermissionFormComponent } from './permissions/form/permission-form.component';
import { LawyerPermissionsComponent } from './permissions/perimissions.component';
import { LawyerContainerComponent } from './lawyer-container/lawyer-container.component';
import { LawyerListComponent } from './list/lawyer-list.component';
import { LawyerDetailComponent } from './detail/lawyer-detail.component';
import { SearchModule } from '@components/search/search.module';
import { DrawerService } from 'app/global/services/lawyer-drawer.service';
import { MatStepperModule } from '@angular/material/stepper';
import { LawyerFormModule } from './form/lawyer-form.module';

registerLocaleData(localePt);
@NgModule({
  declarations: [
    LawyerComponent,
    LawyerContainerComponent,
    LawyerPermissionsComponent,
    PermissionsListComponent,
    LawyerPermissionFormComponent,
    LawyerListComponent,
    LawyerDetailComponent,
  ],
  imports: [
    CommonModule,
    GlobalModule,
    RouterModule.forChild(routes),
    HeaderContentModule,
    SearchModule,
    MatStepperModule,
    LawyerFormModule
  ],
  providers:[
    
    DrawerService,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]
})
export class LawyerModule {}
