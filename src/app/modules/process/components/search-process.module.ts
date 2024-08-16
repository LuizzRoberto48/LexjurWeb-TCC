import { NgModule } from '@angular/core';
import { SearchProcessNewComponent } from '../../../global/components/search-fields/search-process.component';
import { SearchModalListComponent } from './search-process-list/search-modal-list.component';
import { GlobalModule } from 'app/shared/global.module';
import { CommonProcessFieldsComponent } from '../../../global/components/search-fields/common-process-fields/common-process-fields.component';
import { SearchProcessService } from '../../../global/components/search-fields/search-fields.service';
import { CommonDeadlineFieldsComponent } from '../../../global/components/search-fields/common-deadline-fields/common-deadline-fields.component';

@NgModule({
  declarations: [
    SearchProcessNewComponent,
    SearchModalListComponent,
    CommonProcessFieldsComponent,
    CommonDeadlineFieldsComponent
  ],
  imports: [GlobalModule],
  exports: [SearchProcessNewComponent, SearchModalListComponent],
  providers: [SearchProcessService],
})
export class SearchProcessModule {}
