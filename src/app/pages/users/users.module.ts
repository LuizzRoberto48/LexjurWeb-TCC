import { NgModule } from '@angular/core';
import { UsersComponent } from './users.component';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalModule } from 'app/shared/global.module';
import { HeaderContentModule } from '@components/header-content/header-content.module';

const UsersRoutes: Route[] = [
  {
    data: {
      breadcrumb: 'Usuários',
    },
    path: '',
    component: UsersComponent,
  },
];

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    GlobalModule,
    RouterModule.forChild(UsersRoutes),
    HeaderContentModule,
  ],
})
export class UsersModule {}
