import { NgModule } from '@angular/core';

import { GlobalModule } from 'app/shared/global.module';

import { SettingsModule } from '@fuse/components/settings/settings.module';
import { ClassicLayoutModule } from './classic/classic.module';
import { ClassyLayoutModule } from './classy/classy.module';
import { EmptyLayoutModule } from './empty/empty.module';
import { LayoutComponent } from './layout.component';

const layoutModules = [
  ClassicLayoutModule,
  ClassyLayoutModule,
  EmptyLayoutModule,
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [GlobalModule, SettingsModule, ...layoutModules],
  exports: [LayoutComponent, ...layoutModules],
})
export class LayoutModule {}
