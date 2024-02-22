import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GlobalModule } from 'app/shared/global.module';

import { GlDialogModule } from '@components/gl-dialog/gl-dialog.module';
import { ProcessAttachedComponent } from './process-attached.component';

import { AttachedProcessService } from 'app/modules/attached-process/attached-process.service';
import { SearchProcessNewModule } from 'app/global/components/search-process-new.module';

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
    SearchProcessNewModule,
    /* SearchProcessModule */
  ],
  providers:[AttachedProcessService]
})
export class ProcessAttachedModule {}
