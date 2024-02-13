import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilesComponent } from './profiles.component';
import { PermissionsListComponent } from './permissions/list/permissions-list.component';
import { PERMISSIONID, USERID } from 'app/modules/user/profile/profile-helper';
import { UserPermissionFormComponent } from './permissions/form/user-permission-form.component';
import { UserPermissionsComponent } from './permissions/perimissions.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  {
    path: '',
    component: ProfilesComponent,
    data: { breadcrumb: 'Usuários' },
    children: [
      {
        path: '',
        component: UsersComponent,
        data: { id: USERID, breadcrumb: '' },
      },
      {
        path: 'permissions',
        component: UserPermissionsComponent,
        data: { id: PERMISSIONID, breadcrumb: 'Permissões' },
        children: [
          {
            path: '',
            component: PermissionsListComponent,
            data: { id: PERMISSIONID, breadcrumb: '' },
          },
          {
            path: 'new',
            component: UserPermissionFormComponent,
            data: { id: PERMISSIONID, breadcrumb: 'Nova permissão' },
          },
        ],
      },
    ],
  },
];
