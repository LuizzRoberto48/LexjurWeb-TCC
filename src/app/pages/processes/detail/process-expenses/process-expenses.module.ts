import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GlDialogModule } from '@components/gl-dialog/gl-dialog.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { GlobalModule } from 'app/shared/global.module';
import { BreadCrumbModule } from '@components/breadcrumb/breadcrumb.module';
import { MatStepperModule } from '@angular/material/stepper';
import { FilesModule } from 'app/modules/process-files/components/files.module';
import { UploadProcessFileService } from 'app/modules/process-files/services/upload-process.service';
import { ProcessExpensesComponent } from './process-expenses.component';
import { ProcessExpensesService } from 'app/modules/process-expenses/process-expenses.service';
import localePt from '@angular/common/locales/pt';
import { ProcessExpenseFormComponent } from './detail/form/process-expense-form.component';
import { ProcessFormDetailComponent } from './detail/process-expense-detail.component';
import {
  IConfig,
  NgxMaskDirective,
  provideEnvironmentNgxMask,
  provideNgxMask,
} from 'ngx-mask';
import { ProcessExpenseInfoComponent } from './detail/info/process-expense-info.component';
import { ExpenseFormResolver } from 'app/modules/process-expenses/resolver/process-expenses.resolver';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

// Register the locale data for pt-BR
registerLocaleData(localePt);
const routes: Routes = [
  {
    title: 'Lista despesas',
    path: '',
    component: ProcessExpensesComponent,
    data: {
      breadcrumb: () => '',
    },
  },
  {
    title: 'Cadastro de despesa',
    path: 'new',
    component: ProcessFormDetailComponent,
    data: {
      breadcrumb: () => 'Cadastrar',
    },
  },
  {
    title: 'Edição de despesa',
    path: 'edit/:id',
    component: ProcessFormDetailComponent,
    data: {
      breadcrumb: () => 'Editar',
    },
    resolve: {
      data: ExpenseFormResolver,
    },
  },
];

@NgModule({
  declarations: [
    ProcessExpensesComponent,
    ProcessExpenseFormComponent,
    ProcessFormDetailComponent,
    ProcessExpenseInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BreadCrumbModule,
    GlobalModule,
    FuseHighlightModule,
    FuseAlertModule,
    FuseNavigationModule,
    FuseScrollResetModule,
    GlDialogModule,
    MatStepperModule,
    FilesModule,
    NgxMaskDirective,
  ],
  providers: [
    UploadProcessFileService,
    ProcessExpensesService,
    provideNgxMask(),
    provideEnvironmentNgxMask(maskConfig),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
})
export class ProcessExpenseModule {}
