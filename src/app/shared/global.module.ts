import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { ActivePipe } from '../global/pipes/active.pipe';
import { StepsPipe } from 'app/global/pipes/steps-progress.pipe';
import { GlFormsModule } from 'app/global/forms/gl-forms.module';
import { CapitalizePipe } from 'app/global/pipes/cpitalize.pipe';
import { TruncatePipe } from 'app/global/pipes/truncate.pipe';

@NgModule({
  declarations: [
    ActivePipe,
    StepsPipe,
    CapitalizePipe,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    GlFormsModule,
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
    TruncatePipe
  ],
})
export class GlobalModule {}
