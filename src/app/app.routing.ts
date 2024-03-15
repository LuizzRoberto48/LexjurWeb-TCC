import { Route } from '@angular/router';
import { AuthGuard } from 'app/modules/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/modules/auth/guards/noAuth.guard';
import { LayoutComponent } from './layouts/layout.component';

export const appRoutes: Route[] = [
  {
    path: 'sign-in',
    component: LayoutComponent,
    canMatch: [NoAuthGuard],
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'reset-password/:token',
        loadChildren: () =>
          import('app/pages/auth/reset-password/reset-password.module').then(
            (m) => m.AuthResetPasswordModule,
          ),
      },
      {
        path: 'forgot',
        loadChildren: () =>
          import('app/pages/auth/forgot-password/forgot-password.module').then(
            (m) => m.AuthForgotPasswordModule,
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('app/pages/auth/sign-in/sign-in.module').then(
            (m) => m.AuthSignInModule,
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    canMatch: [AuthGuard],
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('app/pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule,
          ),
      },
      {
        path: 'processos',
        loadChildren: () =>
          import('app/pages/processes/processes.module').then(
            (m) => m.ProcessesModule,
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('app/pages/settings/settings.module').then(
            (m) => m.SettingsModule,
          ),
      },
      {
        path: 'lawyers',
        loadChildren: () =>
          import('app/pages/lawyers/lawyer.module').then(
            (m) => m.LawyerModule,
          ),
      },
      {
        path: 'exporter',
        loadChildren: () =>
          import('app/pages/exporter/exporter.module').then(
            (m) => m.ExporterModule,
          ),
      },
    ],
  },
];
