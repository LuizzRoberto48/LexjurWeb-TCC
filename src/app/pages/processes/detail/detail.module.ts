import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';

import { ProcessDetailComponent } from './detail.component';
import { FuseNavigationModule } from '@fuse/components/navigation';
import {
  ATTACHED_PATH,
  EXPENSES_PATH,
  FILES_PATH,
  GENERAL_PATH,
  GUARANTEES_PATH,
  PARTS_PATH,
  PROGRESS_PATH,
  ProcessDetailService,
  REQUESTS_PATH,
  RESOURCE_PATH,
  SCHEDULE_PATH,
} from 'app/modules/process/services/process-detail.service';
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
        redirectTo: GENERAL_PATH,
      },
      {
        title: 'Geral',
        path: GENERAL_PATH,
        component: ProcessGeneralComponent,
        data: {
          breadcrumb: () => 'Geral',
        },
      },
      {
        title: 'Recursos',
        path: RESOURCE_PATH,
        component: ProcessResourcesComponent,
        data: {
          breadcrumb: () => 'Recursos',
        },
      },
      {
        title: 'Agendamentos',
        path: SCHEDULE_PATH,
        data: {
          breadcrumb: () => 'Agendamentos',
        },
        loadChildren: () =>
          import('./deadline-tracker/deadline-tracker.module').then(
            (m) => m.DeadlineTrackerModule,
          ),
      },
      {
        title: 'Andamentos',
        path: PROGRESS_PATH,
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
        path: FILES_PATH,
        data: {
          breadcrumb: () => 'Meus arquivos',
        },
        loadChildren: () =>
          import('./process-files/process-files.module').then(
            (m) => m.ProcessFilesModule,
          ),
      },
      {
        title: 'Despesas',
        path: EXPENSES_PATH,
        data: {
          breadcrumb: () => 'Minhas despesas',
        },
        loadChildren: () =>
          import('./process-expenses/process-expenses.module').then(
            (m) => m.ProcessExpenseModule,
          ),
      },
      {
        title: 'Partes',
        path: PARTS_PATH,
        data: {
          breadcrumb: () => 'Partes envolvidas',
        },
        loadChildren: () =>
          import('./process-parts/process-parts.module').then(
            (m) => m.ProcessPartsModule,
          ),
      },
      {
        title: 'Garantias',
        path: GUARANTEES_PATH,
        data: {
          breadcrumb: () => 'Garantias',
        },
        loadChildren: () =>
          import('./process-guarantees/process-guarantees.module').then(
            (m) => m.ProcessGuaranteesModule,
          ),
      },
      {
        title: 'Pedidos',
        path: REQUESTS_PATH,
        data: {
          breadcrumb: () => 'Pedidos',
        },
        loadChildren: () =>
          import('./process-requests/process-requests.module').then(
            (m) => m.ProcessRequestsModule,
          ),
      },
      {
        title: 'Apensos',
        path: ATTACHED_PATH,
        data: {
          breadcrumb: () => 'Vínculos',
        },
        loadChildren: () =>
          import('./process-attached/process-attached.module').then(
            (m) => m.ProcessAttachedModule,
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
    ResourceFormComponent,
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
