import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProcessRequestsComponent } from './process-requests.component';
import { GlobalModule } from 'app/shared/global.module';

import { GlDialogModule } from '@components/gl-dialog/gl-dialog.module';
import { ProcessRequestsFormComponent } from './form/process-requests-form.component';
import { ProcessRequestsService } from 'app/modules/process-requests/process-requests.service';
import {
  IConfig,
  NgxMaskDirective,
  provideEnvironmentNgxMask,
  provideNgxMask,
} from 'ngx-mask';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

const routes: Routes = [
  {
    title: 'Pedidos',
    path: '',
    component: ProcessRequestsComponent,
    data: {
      breadcrumb: () => '',
    },
  },
];

@NgModule({
  declarations: [ProcessRequestsComponent, ProcessRequestsFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GlobalModule,
    GlDialogModule,
    NgxMaskDirective,
  ],
  providers: [
    ProcessRequestsService,
    provideNgxMask(),
    provideEnvironmentNgxMask(maskConfig),
  ],
})
export class ProcessRequestsModule {}
