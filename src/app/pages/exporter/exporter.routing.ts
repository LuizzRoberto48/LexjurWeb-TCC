import { Route } from '@angular/router';
import { ExporterComponent } from './exporter.component';

export const routes: Route[] = [
  {
    path: '',
    component: ExporterComponent,
    data: {
      breadcrumb: 'Exportador',
    },
  },
];
