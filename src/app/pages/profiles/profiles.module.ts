import { NgModule } from '@angular/core';
import { ProfilesComponent } from './profiles.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalModule } from 'app/shared/global.module';
import { HeaderContentModule } from '@components/header-content/header-content.module';

import { routes } from './profiles.routing';
import { PermissionsListComponent } from './permissions/list/permissions-list.component';
import { UserPermissionFormComponent } from './permissions/form/user-permission-form.component';
import { UserPermissionsComponent } from './permissions/perimissions.component';
import { UsersComponent } from './users/users.component';
import { UserFormComponent } from './users/form/user-form.component';
import { UserListComponent } from './users/list/user-list.component';
import { UserInfoComponent } from './users/info/user-info.component';
import { UserDetailComponent } from './users/detail/user-detail.component';

@NgModule({
  declarations: [
    ProfilesComponent,
    UsersComponent,
    UserPermissionsComponent,
    PermissionsListComponent,
    UserPermissionFormComponent,
    UserFormComponent,
    UserListComponent,
    UserInfoComponent,
    UserDetailComponent,
  ],
  imports: [
    CommonModule,
    GlobalModule,
    RouterModule.forChild(routes),
    HeaderContentModule,
  ],
})
export class ProfilesModule {}
