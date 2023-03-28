
import { Route } from '@angular/router';
import { FormProcessResolver } from 'app/core/process/resolver/process.resolver';
import { FormProcessComponent } from './form/form-process.component';
import { ListProcessComponent } from './list/list-process.component';
import { ProcessComponent } from './process.component';

export const processRoutes: Route[] = [
  {
    path: '',
    component: ProcessComponent,
    data: {
      breadcrumb: 'Processos'
    },
    children: [
      {
        path: 'new',
        component: FormProcessComponent,
        data: { breadcrumb: 'Novo' },

      },
      {
        path: 'edit/:id',
        component: FormProcessComponent,
        data: {
          breadcrumb: (data: any) => `${data.data.caseNumber}`
        },
        resolve: {
          data: FormProcessResolver
        },

      },
      {
        path: '',
        component: ListProcessComponent,
        data: { breadcrumb: '' },
      },
      {
        path: 'detail/:id', loadChildren: () => import('app/modules/admin/processes/detail/detail.module').then(m => m.ProcessDetailModule),
        
      },
    ]
  }
];

