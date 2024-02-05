import { CommonModule } from '@angular/common';
import { GlobalModule } from 'app/shared/global.module';
import { SearchProcessComponent } from './search-process.component';
import { NgModule } from '@angular/core';
import { SearchModalListComponent } from './search-modal-list/search-modal-list.component';

@NgModule({
  declarations: [SearchProcessComponent, SearchModalListComponent],
  exports: [SearchProcessComponent, SearchModalListComponent],
  imports: [CommonModule, GlobalModule],
  providers:[]
})
export class SearchProcessModule {}
