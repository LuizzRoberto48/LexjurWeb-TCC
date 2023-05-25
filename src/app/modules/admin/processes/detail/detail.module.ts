import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { SharedModule } from 'app/shared/shared.module';
import { ProcessDetailComponent } from './detail.component';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { GENERAL, ProcessDetailService, RESOURCE } from 'app/core/process/process-detail.service';
import { ProcessResourcesComponent } from './resources/resources.component';
import { ProcessGeneralComponent } from './general/general.component';
import { FormProcessResolver } from 'app/core/process/resolver/process.resolver';
import { ResourceFormComponent } from './resources/form/resource-form.component';
import { GlDialogModule } from '@components/gl-dialog/gl-dialog.module';
import { ResourceService } from 'app/core/resource/resource.service';

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
      }
    ]
  }
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
        ResourceService
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BreadCrumbModule,
        SharedModule,
        FuseHighlightModule,
        FuseAlertModule,
        FuseNavigationModule,
        FuseScrollResetModule,
        GlDialogModule,
    ]
})
export class ProcessDetailModule {
}
