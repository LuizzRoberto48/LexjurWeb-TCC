import { RouterModule, Routes } from '@angular/router';
import { LawyerComponent } from './lawyer.component';
import { PermissionsListComponent } from './permissions/list/permissions-list.component';
import { PERMISSIONID, USERID } from 'app/modules/user/profile/profile-helper';
import { LawyerPermissionFormComponent } from './permissions/form/permission-form.component';
import { LawyerPermissionsComponent } from './permissions/perimissions.component';
import { LawyerContainerComponent } from './lawyer-container/lawyer-container.component';
import { LawyerDetailComponent } from './detail/lawyer-detail.component';
import { UserPermissionsResolver } from 'app/modules/user-permissions';
import {
  PERMISSIONCREATE,
  PERMISSIONEDIT,
  PERMISSIONLIST,
} from 'app/modules/user-permissions/user-permission.model';
import { LawyerDetailResolver } from 'app/modules/lawyer/resolver/lawyer-detail.resolver';
import { LawyerFormComponent } from './form/lawyer-form.component';
import {
  LAWYERCREATE,
  LAWYERDETAIL,
  LAWYERLIST,
  LAWYERNEDIT,
} from 'app/modules/lawyer/model/lawyer.model';
import { LawyerListGuard } from 'app/modules/lawyer/guard/lawyer-list.guard';
import { LawyerListComponent } from './list/lawyer-list.component';

export const routes: Routes = [
  {
    path: '',
    component: LawyerComponent,
    data: { breadcrumb: 'Usuários' },
    children: [
      {
        path: '',
        component: LawyerContainerComponent,
        data: { id: LAWYERLIST, breadcrumb: '' },
        children: [
          {
            path: '',
            component: LawyerListComponent,
          },
          {
            path: 'detail/:id',
            component: LawyerDetailComponent,
            canLoad: [LawyerListGuard],
            data: { id: LAWYERDETAIL },
            resolve: {
              data: LawyerDetailResolver,
            },
          },
          {
            path: 'new',
            component: LawyerFormComponent,
            data: { id: LAWYERCREATE, breadcrumb: 'Novo' },
          },
          {
            path: 'edit/:id',
            component: LawyerFormComponent,
            data: { id: LAWYERNEDIT, breadcrumb: 'Editar' },
            resolve: {
              data: LawyerDetailResolver,
            },
          },
        ],
      },
      {
        path: 'permissions',
        component: LawyerPermissionsComponent,
        data: { id: PERMISSIONID, breadcrumb: 'Permissões' },

        children: [
          {
            path: '',
            component: PermissionsListComponent,
            data: { id: PERMISSIONLIST, breadcrumb: '' },
          },
          {
            path: 'new',
            component: LawyerPermissionFormComponent,
            data: { id: PERMISSIONCREATE, breadcrumb: 'Nova permissão' },
          },
          {
            path: 'edit/:id',
            component: LawyerPermissionFormComponent,
            data: { id: PERMISSIONEDIT, breadcrumb: 'Editar permissão' },
            resolve: {
              data: UserPermissionsResolver,
            },
          },
        ],
      },
    ],
  },
];
