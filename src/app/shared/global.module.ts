import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { ActivePipe } from '../global/pipes/active.pipe';
import { StepsPipe } from 'app/global/pipes/steps-progress.pipe';
import { GlFormsModule } from 'app/global/forms/gl-forms.module';

@NgModule({
  declarations: [ActivePipe, StepsPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, GlFormsModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    GlFormsModule,
    ActivePipe,
    StepsPipe,
  ],
})
export class GlobalModule {}
