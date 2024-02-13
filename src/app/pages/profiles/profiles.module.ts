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

@NgModule({
  declarations: [
    ProfilesComponent,
    UsersComponent,
    UserPermissionsComponent,
    PermissionsListComponent,
    UserPermissionFormComponent,
  ],
  imports: [
    CommonModule,
    GlobalModule,
    RouterModule.forChild(routes),
    HeaderContentModule,
  ],
})
export class ProfilesModule {}
