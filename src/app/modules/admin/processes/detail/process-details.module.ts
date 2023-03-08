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
import { CoreSheetModule } from 'app/core/cores/core-sheet/core-sheet.module';
import { SharedModule } from 'app/shared/shared.module';
import { ProcessDetailComponent } from './detail.component';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';

const routes: Route[] = [
  {
    path: '',
    component: ProcessDetailComponent,
    data: {
      breadcrumb: 'Detalhe',
    }
  }
];

@NgModule({
  declarations: [
    ProcessDetailComponent
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
    BreadcrumbService
  ]
})
export class ProcessDetailModule {
}
