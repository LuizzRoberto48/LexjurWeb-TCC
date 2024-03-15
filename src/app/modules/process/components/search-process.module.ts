import { NgModule } from '@angular/core';
import { SearchProcessNewComponent } from './search-process/search-process.component';
import { SearchModalListComponent } from './search-process-list/search-modal-list.component';
import { GlobalModule } from 'app/shared/global.module';
import { AppendProcessFieldsComponent } from './search-process/append-process-fields/append-process-fields.component';
import { CommonProcessFieldsComponent } from './search-process/common-process-fields/common-process-fields.component';
import { SearchProcessService } from '../services/search-process.service';

@NgModule({
  declarations: [
    SearchProcessNewComponent,
    SearchModalListComponent,
    AppendProcessFieldsComponent,
    CommonProcessFieldsComponent,
  ],
  imports: [GlobalModule],
  exports: [SearchProcessNewComponent, SearchModalListComponent],
  providers: [SearchProcessService],
})
export class SearchProcessModule {}
