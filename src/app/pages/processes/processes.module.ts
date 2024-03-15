import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormProcessComponent } from './form/form-process.component';
import { ListProcessComponent } from './list/list-process.component';
import { ProcessComponent } from './process.component';
import {
  NgxMaskDirective,
  provideEnvironmentNgxMask,
  provideNgxMask,
} from 'ngx-mask';
import { NotificationModule } from '@fuse/components/notification/notification.module';
import { BreadcrumbService } from '@components/breadcrumb/breadcrumb.service';
import { processRoutes } from './process.routing';
import { IConfig } from 'ngx-mask';
import { GlobalModule } from 'app/shared/global.module';
import { FormProcessService } from 'app/modules/process/services/form-process.service';
import { HeaderContentModule } from '@components/header-content/header-content.module';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [ProcessComponent, FormProcessComponent, ListProcessComponent],
  imports: [
    RouterModule.forChild(processRoutes),
    NgxMaskDirective,
    NotificationModule,
    GlobalModule,
    HeaderContentModule
  ],
  providers: [
    FormProcessService,
    provideNgxMask(),
    provideEnvironmentNgxMask(maskConfig),
    BreadcrumbService,
  ],
})
export class ProcessesModule {}
