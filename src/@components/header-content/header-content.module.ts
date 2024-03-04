import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderContentComponent } from './header-content.component';
import { CoreSheetModule } from 'app/modules/cores/core-sheet/core-sheet.module';
import { MaterialModule } from 'app/shared/material.module';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';

@NgModule({
  declarations: [HeaderContentComponent],
  imports: [CommonModule, MaterialModule, BreadCrumbModule, CoreSheetModule],
  exports: [CommonModule, HeaderContentComponent, ],
})
export class HeaderContentModule {}
