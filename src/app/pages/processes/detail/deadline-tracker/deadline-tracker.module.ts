import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DeadlineTrackerDetailComponent } from './detail/deadline-tracker-detail.component';
import { GlDialogModule } from '@components/gl-dialog/gl-dialog.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { GlobalModule } from 'app/shared/global.module';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { DeadLineTrackerComponent } from './deadline-tracker.component';
import { MatStepperModule } from '@angular/material/stepper';
import { DeadlineTrackerFormComponent } from './detail/form/deadline-tracker-form.component';
import { DeadlineFormResolver } from 'app/modules/deadline-trackers/resolver/deadline-tracker.resolver';
import { FilesModule } from 'app/modules/process-files/components/files.module';
import { UploadProcessFileService } from 'app/modules/process-files/services/upload-process.service';
import { DeadlineTrackerInfoComponent } from './detail/info/deadline-tracker-info.component';


const routes: Routes = [
  {
    
    path: '',
    component: DeadLineTrackerComponent,
    data: {
      breadcrumb: () => '',
    },
  },
  {
    title: 'Cadastro de agendamento',
    path: 'new',
    component: DeadlineTrackerDetailComponent,
    data: {
      breadcrumb: () => 'Cadastrar',
    },
  },
  {
    title: 'Edição de agendamento',
    path: 'edit/:id',
    component: DeadlineTrackerDetailComponent,
    data: {
      breadcrumb: () => 'Editar',
    },
    resolve: {
      data: DeadlineFormResolver,
    },
  },
];

@NgModule({
  declarations: [
    DeadlineTrackerDetailComponent,
    DeadLineTrackerComponent,
    DeadlineTrackerFormComponent,
    DeadlineTrackerInfoComponent
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
    MatStepperModule,
    FilesModule,
    
  ],
  providers: [UploadProcessFileService],
})
export class DeadlineTrackerModule {}
