import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';

import { ProcessDetailComponent } from './detail.component';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { ProcessDetailService } from 'app/modules/process/process-detail.service';
import { ProcessResourcesComponent } from './resources/resources.component';
import { ProcessGeneralComponent } from './general/general.component';
import { FormProcessResolver } from 'app/modules/process/resolver/process.resolver';
import { ResourceFormComponent } from './resources/form/resource-form.component';
import { GlDialogModule } from '@components/gl-dialog/gl-dialog.module';
import { ResourceService } from 'app/modules/resource/resource.service';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { GlobalModule } from 'app/shared/global.module';
import { DeadlineTrackerTypeService } from 'app/modules/deadline-trackers/deadline-tracker-types.service';
import { DeadlineTrackerSubTypeService } from 'app/modules/deadline-trackers/deadline-tracker-subtypes.service';


const routes: Route[] = [
  {
    path: '',
    component: ProcessDetailComponent,
    resolve: {
      data: FormProcessResolver,
    },
    data: {
      breadcrumb: (data: any) => `${data.data.caseNumber}`,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'general',
      },
      {
        title: 'geral',
        path: 'general',
        component: ProcessGeneralComponent,
        data: {
          breadcrumb: () => 'Geral',
        },
      },
      {
        title: 'recurso',
        path: 'resources',
        component: ProcessResourcesComponent,
        data: {
          breadcrumb: () => 'Recursos',
        },
      },
      {
        title: 'agendamento',
        path: 'schedule',
        data: {
          breadcrumb: () => 'Agendamentos',
        },
        loadChildren: () =>
          import('./deadline-tracker/deadline-tracker.module').then(
            (m) => m.DeadlineTrackerModule,
          ),
      },
      {
        title: 'andamento',
        path: 'progress',
        data: {
          breadcrumb: () => 'Andamento',
        },
        loadChildren: () =>
          import('./process-progress/process-progress.module').then(
            (m) => m.ProcessProgressModule,
          ),
      },
      {
        title: 'Arquivos',
        path: 'files',
        data: {
          breadcrumb: () => 'Meus arquivos',
        },
        loadChildren: () =>
          import('./process-files/process-files.module').then(
            (m) => m.ProcessFilesModule,
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [
    ProcessDetailComponent,
    ProcessResourcesComponent,
    ProcessGeneralComponent,
    ResourceFormComponent
  ],
  providers: [
    BreadcrumbService,
    ProcessDetailService,
    ResourceService,
    DeadlineTrackerService,
    DeadlineTrackerTypeService,
    DeadlineTrackerSubTypeService,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BreadCrumbModule,
    GlobalModule,
    FuseNavigationModule,
    GlDialogModule,
  ],
})
export class ProcessDetailModule {}
