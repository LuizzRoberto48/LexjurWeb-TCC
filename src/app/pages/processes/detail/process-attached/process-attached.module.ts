import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GlobalModule } from 'app/shared/global.module';
import { ProcessAttachedComponent } from './process-attached.component';
import { AttachedProcessService } from 'app/modules/attached-process/attached-process.service';
import { SearchProcessModule } from 'app/modules/process/components/search-process-list/search-process.module';


const routes: Routes = [
  {
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
    SearchProcessModule,
  ],
  providers:[AttachedProcessService]
})
export class ProcessAttachedModule {}
