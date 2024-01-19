import { Injectable } from '@angular/core';
import { UploadType } from './upload.model';
import { doc, excel, jpeg, pdf, png, txt } from './utils/accepted-types';

@Injectable({ providedIn: 'any' })
export class UploadFileService {
  acceptedTypes: UploadType[] = [];
  private hasCloseBtn = true;
  constructor() {
    this.acceptedTypes.push(excel(), doc(), txt(), pdf(), png(), jpeg());
  }

  set closeBtn(hasClose: boolean) {
    this.hasCloseBtn = hasClose;
  }

  get closeBtn() {
    return this.hasCloseBtn;
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
