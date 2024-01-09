import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GlobalModule } from 'app/shared/global.module';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';

import { ProcessProgressComponent } from './list/process-progress.component';
import { ProcessProgressDetailComponent } from './detail/progress-detail.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ProgressFormComponent } from './detail/form/progress-form.component';
import { FilesModule } from 'app/modules/process-files/components/files.module';

const routes: Routes = [
  {
    title: 'Andamentos',
    path: '',
    component: ProcessProgressComponent,
    data: {
      breadcrumb: () => '',
    },
  },
  {
    title: 'Cadastro de Andamento',
    path: 'new',
    component: ProcessProgressDetailComponent,
    data: {
      breadcrumb: () => 'Cadastrar',
    },
  },
];

@NgModule({
  declarations: [ProcessProgressComponent, ProcessProgressDetailComponent, ProgressFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BreadCrumbModule,
    GlobalModule,
    MatStepperModule,
    FilesModule
  ]
})
export class ProcessProgressModule {}
