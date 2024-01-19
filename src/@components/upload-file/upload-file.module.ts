import { NgModule } from '@angular/core';

import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { CommonModule } from '@angular/common';
import { UploadFileComponent } from './upload-file.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
import { UploadFileCardComponent } from './upload-file-card/upload-file-card.component';
import { GlobalModule } from 'app/shared/global.module';

@NgModule({
  declarations: [UploadFileComponent,UploadFileCardComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    NgxFileDropModule,
    GlobalModule
  ],
  exports: [UploadFileComponent, UploadFileCardComponent],
  providers: [
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory: (overlay: Overlay) => (): BlockScrollStrategy =>
        overlay.scrollStrategies.block(),
      deps: [Overlay],
    },
  ],
})
export class UploadModule {}
