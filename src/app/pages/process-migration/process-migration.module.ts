import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessMigrationComponent } from './process-migration.component';

import { Route, RouterModule } from '@angular/router';
import { GlobalModule } from 'app/shared/global.module';
import { HeaderContentModule } from '@components/header-content/header-content.module';
import { MigrationProcessFormComponent } from './migration-form/migration-form.component';
import { GlDialogModule } from '@components/gl-dialog/gl-dialog.module';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { ProcessesModule } from '../processes/processes.module';
import { SearchProcessModule } from 'app/modules/process/components/search-process-list/search-process.module';
import { ProcessTableModule } from 'app/modules/process/components/process-table/process-table.module';

export const routes: Route[] = [
  {
    path: '',
    component: ProcessMigrationComponent,
    data: {
      breadcrumb: 'Migração de processos',
    },
  },
];

@NgModule({
  declarations: [
    ProcessMigrationComponent,
    MigrationProcessFormComponent
  ],
  imports: [
    CommonModule,
    GlobalModule,
    RouterModule.forChild(routes),
    HeaderContentModule,
    SearchProcessModule,
    GlDialogModule,
    FuseLoadingBarModule,
    ProcessTableModule
  ]
})
export class ProcessMigrationModule { }
