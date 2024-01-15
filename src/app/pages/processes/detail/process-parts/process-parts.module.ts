import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProcessPartsService } from 'app/modules/process-parts/process-parts.service';
import { ProcessPartsComponent } from './process-parts.component';
import { GlobalModule } from 'app/shared/global.module';

import { GlDialogModule } from '@components/gl-dialog/gl-dialog.module';
import { ProcessPartsFormComponent } from './form/process-parts-form.component';

const routes: Routes = [
  {
    title: 'Partes',
    path: '',
    component: ProcessPartsComponent,
    data: {
      breadcrumb: () => '',
    },
  },
];

@NgModule({
  declarations: [ProcessPartsComponent, ProcessPartsFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GlobalModule,
    GlDialogModule,
  ],
  providers: [ProcessPartsService],
})
export class ProcessPartsModule {}
