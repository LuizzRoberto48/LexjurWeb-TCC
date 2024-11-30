import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { GlobalModule } from 'app/shared/global.module';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProcessFilesComponent } from './process-files.component';
import { FilesModule } from 'app/modules/process-files/components/files.module';

const routes: Routes = [
  {
    path: '',
    component: ProcessFilesComponent,
    data: {
      breadcrumb: () => '',
    },
  },
];

@NgModule({
  declarations: [ProcessFilesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BreadCrumbModule,
    GlobalModule,
    FuseAlertModule,
    MatButtonToggleModule,
    FilesModule,
  ],
  providers: [],
})
export class ProcessFilesModule {}
