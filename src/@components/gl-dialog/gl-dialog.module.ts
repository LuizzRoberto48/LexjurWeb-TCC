import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared/material.module';
import { GlDialogComponent } from './gl-dialog.component';

@NgModule({
  declarations: [GlDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [GlDialogComponent],
})
export class GlDialogModule {}
