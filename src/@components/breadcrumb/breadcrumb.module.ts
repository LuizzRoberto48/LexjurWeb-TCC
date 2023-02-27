import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbComponent } from './breadcrumb.component';

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [
    CommonModule,

  ],
  exports: [
    CommonModule,
    BreadcrumbComponent
  ],
  providers: [BreadcrumbService]
})
export class BreadCrumbModule {
}
