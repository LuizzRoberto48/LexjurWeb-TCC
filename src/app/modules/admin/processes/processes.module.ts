import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/core/material.module';
import { FormProcessComponent } from './form/form-process.component';
import { ListProcessComponent } from './list/list-process.component';
import { ProcessComponent } from './process.component';


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
    RouterModule.forChild(exampleRoutes),
    MaterialModule
  ]
})
export class ProcessesModule {
}
