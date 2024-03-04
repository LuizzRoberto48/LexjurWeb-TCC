import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { ActivePipe } from '../global/pipes/active.pipe';
import { StepsPipe } from 'app/global/pipes/steps-progress.pipe';
import { GlFormsModule } from 'app/global/forms/gl-forms.module';
import { CapitalizePipe } from 'app/global/pipes/cpitalize.pipe';
import { TruncatePipe } from 'app/global/pipes/truncate.pipe';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { JoinArrayPipe } from 'app/global/pipes/join-array.pipe';
import { HasPermission } from 'app/modules/user-permissions/directives/has-permission.directive';



@NgModule({
  declarations: [
    ActivePipe,
    StepsPipe,
    CapitalizePipe,
    TruncatePipe,
    JoinArrayPipe,
    HasPermission,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    GlFormsModule,
    BreadCrumbModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    GlFormsModule,
    ActivePipe,
    StepsPipe,
    CapitalizePipe,
    TruncatePipe,
    JoinArrayPipe,
    HasPermission,
  ],
})
export class GlobalModule {}
