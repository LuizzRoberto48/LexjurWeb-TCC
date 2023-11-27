import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { SettingsComponent } from "./settings.component";

const routes: Route[] = [
  {
    path: '',
    component: SettingsComponent,
    
  }
];

@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SettingsRoutingModule {
}
