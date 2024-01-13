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
import { MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ProcessProgressTypeService } from 'app/modules/process-progress/progress_type.service';
import { ProcessProgressInfoComponent } from './detail/info/process-progress-info.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

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
  {
    title: 'Edição de Andamento',
    path: 'edit/:id',
    component: ProcessProgressDetailComponent,
    data: {
      breadcrumb: () => 'Editar',
    },
  },
];

@NgModule({
  declarations: [
    ProcessProgressComponent,
    ProcessProgressDetailComponent,
    ProgressFormComponent,
    ProcessProgressInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BreadCrumbModule,
    GlobalModule,
    MatStepperModule,
    FilesModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    ProcessProgressTypeService,
  ],
})
export class ProcessProgressModule {}
