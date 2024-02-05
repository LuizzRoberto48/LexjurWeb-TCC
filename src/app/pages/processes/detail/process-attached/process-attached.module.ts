import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GlobalModule } from 'app/shared/global.module';

import { GlDialogModule } from '@components/gl-dialog/gl-dialog.module';
import { ProcessAttachedComponent } from './process-attached.component';
import { SearchProcessModule } from 'app/modules/process/components/search-process/search-process.module';

const routes: Routes = [
  {
    title: 'Apenso',
    path: '',
    component: ProcessAttachedComponent,
    data: {
      breadcrumb: () => '',
    },
  },
];

@NgModule({
  declarations: [ProcessAttachedComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GlobalModule,
    GlDialogModule,
    SearchProcessModule
  ],
})
export class ProcessAttachedModule {}
