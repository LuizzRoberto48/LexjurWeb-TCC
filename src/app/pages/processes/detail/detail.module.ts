import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';

import { ProcessDetailComponent } from './detail.component';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { GENERAL, ProcessDetailService, RESOURCE, SCHEDULE } from 'app/modules/process/process-detail.service';
import { ProcessResourcesComponent } from './resources/resources.component';
import { ProcessGeneralComponent } from './general/general.component';
import { FormProcessResolver } from 'app/modules/process/resolver/process.resolver';
import { ResourceFormComponent } from './resources/form/resource-form.component';
import { GlDialogModule } from '@components/gl-dialog/gl-dialog.module';

import { ResourceService } from 'app/modules/process/resource/resource.service';

import { DeadlineTrackerFormComponent } from './deadline-tracker/form/deadline-tracker-form.component';
import { DeadLineTrackerComponent } from './deadline-tracker/deadline-tracker.component';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { GlobalModule } from 'app/shared/global.module';


const routes: Route[] = [
  {
    path: '',
    component: ProcessDetailComponent,
    resolve: {
      data: FormProcessResolver
    },
    data: {
      breadcrumb: (data: any) => `${data.data.caseNumber}`
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
        data: {
          breadcrumb: () => 'Geral'
        }
      },
      {
        title: RESOURCE,
        path: 'resources',
        component: ProcessResourcesComponent,
        data: {
          breadcrumb: () => 'Recursos'
        },
      },
      {
        title: SCHEDULE,
        path: 'schedule',
        component: DeadLineTrackerComponent,
        data: {
          breadcrumb: () => 'Agendamento'
        },
      }
    ]
  }
];

@NgModule({
    declarations: [
        ProcessDetailComponent,
        ProcessResourcesComponent,
        ProcessGeneralComponent,
        ResourceFormComponent,
        DeadLineTrackerComponent,
        DeadlineTrackerFormComponent
    ],
    providers: [
        BreadcrumbService,
        ProcessDetailService,
        ResourceService,
        DeadlineTrackerService
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BreadCrumbModule,
        GlobalModule,
        FuseHighlightModule,
        FuseAlertModule,
        FuseNavigationModule,
        FuseScrollResetModule,
        GlDialogModule,
    ]
})
export class ProcessDetailModule {
}
