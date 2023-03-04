import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FormProcessService } from '../../../core/process/form-process-form.service';
import { FormProcessComponent } from './form/form-process.component';
import { ListProcessComponent } from './list/list-process.component';
import { ProcessComponent } from './process.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { NotificationModule } from '@fuse/components/notification/notification.module';
import { LawyerService } from 'app/core/lawyer/lawyer.service';
import { FormProcessResolver } from './form/process.resolver';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { ChangeCoreDirective } from 'app/core/cores/directive/change-core.directive';
import { CoreSheetModule } from 'app/core/cores/core-sheet/core-sheet.module';

const routes: Route[] = [
  {
    path: '',
    component: ProcessComponent,
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',

      },
      {
        path: 'new',
        component: FormProcessComponent,
        data: { breadcrumb: 'Novo' },

      },
      {
        path: 'edit/:id',
        component: FormProcessComponent,
        data: {
          breadcrumb: (data: any) =>`${data.data.caseNumber}`},
        resolve: {
          data: FormProcessResolver
        },

      },
      {
        path: 'list',
        component: ListProcessComponent,
        data: { breadcrumb: 'lista' },
      }
    ]
  }
];

@NgModule({
  declarations: [
    ProcessComponent,
    FormProcessComponent,
    ListProcessComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    NgxMaskDirective,
    NotificationModule,
    BreadCrumbModule,
    CoreSheetModule
  ],
  providers: [
    FormProcessService,
    LawyerService,
    provideNgxMask(),
    BreadcrumbService
  ]
})
export class ProcessesModule {
}
