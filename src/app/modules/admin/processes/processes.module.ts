import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/core/material.module';
import { FormProcessService } from '../../../core/process/form-process-form.service';
import { FormProcessComponent } from './form/form-process.component';
import { ListProcessComponent } from './list/list-process.component';
import { ProcessComponent } from './process.component';
import {  IConfig, NgxMaskDirective, provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask'
import { FuseAlertModule } from '@fuse/components/alert';
import { NotificationModule } from '@fuse/components/notification/notification.module';
import { LawyerService } from 'app/core/lawyer/lawyer.service';

const exampleRoutes: Route[] = [
  {
    path: '',
    component: ProcessComponent,
    
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'new',
        component: FormProcessComponent, 
      },
      {
        path: 'list',
        component: ListProcessComponent,
        
      }
    ]
  }
];

@NgModule({
  declarations: [
    ProcessComponent,
    FormProcessComponent,
    ListProcessComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(exampleRoutes),
    MaterialModule,
    NgxMaskDirective,
    NotificationModule
  ],
  providers:[
    FormProcessService,
    LawyerService,
    provideNgxMask()
  ]
})
export class ProcessesModule {
}
