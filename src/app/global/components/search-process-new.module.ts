import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchProcessNewComponent } from './search-process/search-process-new.component';
import { SearchModalListComponent } from './search-process-list/search-modal-list.component';
import { GlobalModule } from 'app/shared/global.module';

@NgModule({
  declarations: [SearchProcessNewComponent, SearchModalListComponent],
  imports: [CommonModule, GlobalModule],
  exports: [SearchProcessNewComponent, SearchModalListComponent],
})
export class SearchProcessNewModule {}
