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
@Component({
  selector: 'gl-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  providers: [UploadFileService],
})
export class UploadFileComponent implements OnChanges{
  @Input() hasCloseBtn: true;
  @Input() file: File;
  @Input() title:string;
  extension: string;
  acceptedTypes: UploadType[] = [];
  uploadType: UploadType = {} as UploadType;

  @Output() changedFile: EventEmitter<{ file: File; type: UploadType }> =
    new EventEmitter();

  constructor(private service: UploadFileService) {
    this.acceptedTypes = this.service.acceptedTypes;
    this.service.closeBtn = this.hasCloseBtn;
  }

  ngOnChanges() {
    /* Para edição */
    if (this.file) this.uploadType = this.getFile(this.file);
    this.uploadType.target = this.title
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
    this.file = null;
  }

  changeFile(file: File) {
    this.uploadType = this.getFile(file);
    this.file = file;
    this.changedFile.emit({ file: this.file, type: this.uploadType });
  }

  getFile(file): UploadType {
    const acceptFile = this.acceptedFile(file);
    //TODO:return messagem que não possui suporte para o formato solicitado
    if (!acceptFile) return; 
    const uploadType = acceptFile;
    uploadType.label = file.name;
    return uploadType;
  }


  acceptedFile(file: File) {
    const found = this.acceptedTypes.find(
      (accepted) => accepted.accept == file.type,
    );
    if (!found) {
      this.file = null;
      throw new Error('Esta extensão não é permitida');
    }
    return found;
  }
}
