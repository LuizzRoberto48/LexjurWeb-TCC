import { NgModule } from "@angular/core";
import { UsersComponent } from "./users.component";
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { GlobalModule } from "app/shared/global.module";

const UsersRoutes: Route[] = [
    {
      path: '',
      component: UsersComponent
    }
  ];

@NgModule({
    declarations: [UsersComponent],
    imports: [
        CommonModule,GlobalModule,
        RouterModule.forChild(UsersRoutes)
    ]
})

export class UsersModule{

}