import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { SchedulesComponent } from './schedules.component';
import { HeaderContentModule } from '@components/header-content/header-content.module';
import { ProcessProgressModule } from '../processes/detail/process-progress/process-progress.module';


const exampleRoutes: Route[] = [
  {
    path: '',
    component: SchedulesComponent
  }
];

@NgModule({
  declarations: [
    SchedulesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(exampleRoutes),
    MaterialModule,
    HeaderContentModule,
    //ProcessProgressModule
  ]
})
export class SchedulesModule {
}
