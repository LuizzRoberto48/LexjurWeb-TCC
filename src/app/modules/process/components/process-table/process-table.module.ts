import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessTableComponent } from './process-table.component';
import { MaterialModule } from 'app/shared/material.module';
import { GlobalModule } from 'app/shared/global.module';



@NgModule({
  declarations: [
    ProcessTableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GlobalModule
  ],
  exports:[
    ProcessTableComponent
  ]
})
export class ProcessTableModule { }
