import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { UploadType } from './upload.model';
import { UploadFileService } from './upload-file.service';
import { NotificationService } from '@fuse/components/notification/notification.service';
@Component({
  selector: 'gl-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  providers: [UploadFileService],
})
export class UploadFileComponent {
  @Input() hasCloseBtn: true;
  @Input() uploadType: UploadType;
  @Input() noDownload:boolean = false;
  file:File;
  extension: string;
  acceptedTypes: UploadType[] = [];


  @Output() changedFile: EventEmitter<{ file: File; type: UploadType }> =
    new EventEmitter();

  constructor(
    private service: UploadFileService,
    private notification: NotificationService,
  ) {
    this.acceptedTypes = this.service.acceptedTypes;
    this.service.closeBtn = this.hasCloseBtn;
  }

  fileDrop(file) {
    const droppedFile = file[0] as NgxFileDropEntry;
    if (!droppedFile.fileEntry.isFile) return;
    const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
    fileEntry.file((file: File) => {
      this.changeFile(file);
    });
  }

  removeFile() {
    this.uploadType = null;
    this.file = null;
  }

  changeFile(file: File) {
    this.uploadType = this.setUploadType(file)
    this.changedFile.emit({ file, type: this.uploadType });
  }

  setUploadType(file:File): UploadType {
    const acceptFile = this.acceptedFile(file);
    if (!acceptFile) return;
    const uploadType = acceptFile;
    uploadType.label = file.name;
    return uploadType;
  }
  
  acceptedFile(file: File) {
    const found = this.acceptedTypes.find(
      (accepted) => accepted.accept.includes(file.type),
    );
    if (!found) {
      this.notification.danger('Extensão não permitida');
    }
    return found;
  }
}
