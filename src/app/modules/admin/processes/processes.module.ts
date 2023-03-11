import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {  RouterModule } from '@angular/router';
import { FormProcessService } from '../../../core/process/form-process.service';
import { FormProcessComponent } from './form/form-process.component';
import { ListProcessComponent } from './list/list-process.component';
import { ProcessComponent } from './process.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { NotificationModule } from '@fuse/components/notification/notification.module';
import { LawyerService } from 'app/core/lawyer/lawyer.service';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { CoreSheetModule } from 'app/core/cores/core-sheet/core-sheet.module';
import { SharedModule } from 'app/shared/shared.module';
import { processRoutes } from './process.routing';

@NgModule({
  declarations: [
    ProcessComponent,
    FormProcessComponent,
    ListProcessComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(processRoutes),
    NgxMaskDirective,
    NotificationModule,
    BreadCrumbModule,
    CoreSheetModule,
    SharedModule
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
