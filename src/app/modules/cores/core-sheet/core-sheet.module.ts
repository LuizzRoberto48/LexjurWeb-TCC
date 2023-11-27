import { NgModule } from '@angular/core';
import { CoreSheedList } from './core-sheet.component';
import { ChangeCoreDirective } from '../directive/change-core.directive';
import { GlobalModule } from 'app/shared/global.module';

@NgModule({
  declarations: [CoreSheedList, ChangeCoreDirective],
  imports: [GlobalModule],
  exports: [CoreSheedList, ChangeCoreDirective],
})
export class CoreSheetModule {}
