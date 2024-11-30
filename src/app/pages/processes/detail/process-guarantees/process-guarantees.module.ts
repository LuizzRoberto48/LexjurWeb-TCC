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
import { ProcessGuaranteesComponent } from './process-guarantees.component';
import localePt from '@angular/common/locales/pt';
import { ProcessGuaranteeFormComponent } from './detail/form/process-guarantee-form.component';
import {
  IConfig,
  NgxMaskDirective,
  provideEnvironmentNgxMask,
  provideNgxMask,
} from 'ngx-mask';
import { GuaranteeResolver } from 'app/modules/process-guarantees/resolver/guarantees.resolver';
import { ProcessGuaranteeService } from 'app/modules/process-guarantees/process-guarantee.service';
import { GuaranteeDetailComponent } from './detail/guarantee-detail.component';
import { ProcessGuaranteeInfoComponent } from './detail/info/guarantee-info.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

// Register the locale data for pt-BR
registerLocaleData(localePt);
const routes: Routes = [
  {
    path: '',
    component: ProcessGuaranteesComponent,
    data: {
      breadcrumb: () => '',
    },
  },
  {
    title: 'Cadastro de despesa',
    path: 'new',
    component: GuaranteeDetailComponent,
    data: {
      breadcrumb: () => 'Cadastrar',
    },
  },
  {
    title: 'Edição de despesa',
    path: 'edit/:id',
    component: GuaranteeDetailComponent,
    data: {
      breadcrumb: () => 'Editar',
    },
    resolve: {
      data: GuaranteeResolver,
    },
  },
];

@NgModule({
  declarations: [
    ProcessGuaranteesComponent,
    ProcessGuaranteeFormComponent,
    GuaranteeDetailComponent,
    ProcessGuaranteeInfoComponent
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
    ProcessGuaranteeService,
    provideNgxMask(),
    provideEnvironmentNgxMask(maskConfig),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
})
export class ProcessGuaranteesModule {}
