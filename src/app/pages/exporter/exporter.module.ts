import { LOCALE_ID, NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { GlobalModule } from 'app/shared/global.module';
import { HeaderContentModule } from '@components/header-content/header-content.module';
import localePt from '@angular/common/locales/pt';
import { routes } from './exporter.routing';
import { ExporterComponent } from './exporter.component';
import { SearchProcessModule } from 'app/modules/process/components/search-process.module';


registerLocaleData(localePt);
@NgModule({
  declarations: [ExporterComponent],
  imports: [
    CommonModule,
    GlobalModule,
    RouterModule.forChild(routes),
    HeaderContentModule,
    SearchProcessModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
})
export class ExporterModule {}
