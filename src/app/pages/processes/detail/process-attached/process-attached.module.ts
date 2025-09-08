import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GlobalModule } from 'app/shared/global.module';
import { ProcessAttachedComponent } from './process-attached.component';
import { AttachedProcessService } from 'app/modules/attached-process/attached-process.service';
import { SearchProcessModule } from 'app/modules/process/components/search-process-list/search-process.module';
import { NewAttachProcessComponent } from './new/new-attach.component';
import { ProcessTableModule } from 'app/modules/process/components/process-table/process-table.module';


const routes: Routes = [
  {
    path: '',
    component: ProcessAttachedComponent,
    data: {
      breadcrumb: () => '',
    },
  },
  {
      title: 'Adicionar apenso',
      path: 'new',
      component: NewAttachProcessComponent,
      data: {
        breadcrumb: () => 'Adicionar',
      },
    },
];

@NgModule({
  declarations: [ProcessAttachedComponent, NewAttachProcessComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GlobalModule,
    SearchProcessModule,
    ProcessTableModule
  ],
  providers:[AttachedProcessService]
})
export class ProcessAttachedModule {}
