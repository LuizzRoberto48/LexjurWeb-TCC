import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';


export const appRoutes: Route[] = [
  {
    path: 'sign-in',
    component: LayoutComponent,
    canMatch: [NoAuthGuard],
    data: {
      layout: 'empty'
    },
    //canMatch: [NoAuthGuard],
    children: [
      { path: 'reset-password/:token', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
      { path: 'forgot', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
      { path: '', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) }
    ]
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
      { path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.module').then(m => m.DashboardModule) },
    ]
  }
];
