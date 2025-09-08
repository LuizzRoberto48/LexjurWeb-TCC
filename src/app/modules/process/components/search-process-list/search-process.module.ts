import { NgModule } from '@angular/core';
import { SearchProcessNewComponent } from 'app/global/components/search-fields/search-process.component';
import { SearchModalListComponent } from './search-modal-list.component';
import { CommonProcessFieldsComponent } from 'app/global/components/search-fields/common-process-fields/common-process-fields.component';
import { CommonDeadlineFieldsComponent } from 'app/global/components/search-fields/common-deadline-fields/common-deadline-fields.component';
import { GlobalModule } from 'app/shared/global.module';
import { SearchProcessService } from 'app/global/components/search-fields/search-fields.service';
import { ProcessTableModule } from '../process-table/process-table.module';


@NgModule({
  declarations: [
    SearchProcessNewComponent,
    SearchModalListComponent,
    CommonProcessFieldsComponent,
    CommonDeadlineFieldsComponent
  ],
  imports: [GlobalModule, ProcessTableModule],
  exports: [SearchProcessNewComponent, SearchModalListComponent],
  providers: [SearchProcessService],
})
export class SearchProcessModule {}
