
import { Route } from '@angular/router';
import { FormProcessComponent } from './form/form-process.component';
import { FormProcessResolver } from './form/process.resolver';
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
        path: 'detail', loadChildren: () => import('app/modules/admin/processes/detail/process-details.module').then(m => m.ProcessDetailModule)
      },
    ]
  }
];

