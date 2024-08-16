import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { SchedulesComponent } from './schedules.component';
import { HeaderContentModule } from '@components/header-content/header-content.module';
import { SearchProcessModule } from 'app/modules/process/components/search-process.module';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { GlobalModule } from 'app/shared/global.module';

const exampleRoutes: Route[] = [
  {
    path: '',
    component: SchedulesComponent,
  },
];

@NgModule({
  declarations: [SchedulesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(exampleRoutes),
    HeaderContentModule,
    SearchProcessModule,
    GlobalModule,
  ],
  providers: [DeadlineTrackerService],
})
export class SchedulesModule {}
