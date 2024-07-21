import { Injectable } from '@angular/core';
import { UploadType } from './upload.model';
import { doc, excel, jpeg, jpg, pdf, png, txt } from './utils/accepted-types';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadFileService {
  private $onDownload: Subject<UploadType> = new Subject();
  private hasCloseBtn = true;
  
  $download = this.$onDownload.asObservable();
  acceptedTypes: UploadType[] = [];

  constructor() {
    this.acceptedTypes.push(excel(), doc(), txt(), pdf(), png(), jpeg(), jpg());
  }

  set closeBtn(hasClose: boolean) {
    this.hasCloseBtn = hasClose;
  }

  get closeBtn() {
    return this.hasCloseBtn;
  }

  set download(fileType: UploadType) {
    this.$onDownload.next(fileType);
  }

  makeDownload(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
