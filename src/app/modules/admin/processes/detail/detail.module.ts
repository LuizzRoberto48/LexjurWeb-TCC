import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { NotificationModule } from '@fuse/components/notification/notification.module';
import { LawyerService } from 'app/core/lawyer/lawyer.service';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { SharedModule } from 'app/shared/shared.module';
import { ProcessDetailComponent } from './detail.component';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { FormProcessResolver } from '../form/process.resolver';
import { GENERAL, ProcessDetailService, RESOURCE } from 'app/core/process/process-detail.service';
import { ProcessResourcesComponent } from './resources/resources.component';
import { ProcessGeneralComponent } from './general/general.component';

const routes: Route[] = [
  {
    path: '',
    component: ProcessDetailComponent,
    
    data: {
      breadcrumb: (data: any) => `${data.data.caseNumber}`
    },
    resolve: {
      data: FormProcessResolver
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'general',
      },
      {
        title: GENERAL,
        path: 'general',
        component: ProcessGeneralComponent,
      },
      {
        title: RESOURCE,
        path: 'resources',
        component: ProcessResourcesComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    ProcessDetailComponent,
    ProcessResourcesComponent,
    ProcessGeneralComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    BreadCrumbModule,
    SharedModule,
    FuseHighlightModule,
    FuseAlertModule,
    FuseNavigationModule,
    FuseScrollResetModule,
  ],
  providers: [
    BreadcrumbService,
    ProcessDetailService
  ]
})
export class ProcessDetailModule {
}
