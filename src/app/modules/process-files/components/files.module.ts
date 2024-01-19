import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseAlertModule } from '@fuse/components/alert';
import { GlobalModule } from 'app/shared/global.module';
import { FilesListComponent } from './files-list/files-list.component';
import { FilesFormComponent } from './files-form/files-form.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UploadModule } from '@components/upload-file/upload-file.module';

@NgModule({
  declarations: [FilesListComponent, FilesFormComponent],
  imports: [
    CommonModule,
    GlobalModule,
    FuseAlertModule,
    MatButtonToggleModule,
    UploadModule,
  ],
  exports: [FilesListComponent, FilesFormComponent],
})
export class FilesModule {}
