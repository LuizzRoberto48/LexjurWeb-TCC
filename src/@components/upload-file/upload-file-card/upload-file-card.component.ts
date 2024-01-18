import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UploadFileService } from '../upload-file.service';
import { UploadType } from '../upload.model';

@Component({
  selector: 'upload-file-card',
  templateUrl: './upload-file-card.component.html',
  styleUrls: ['./upload-file-card.component.scss'],
})
export class UploadFileCardComponent {
  acceptedTypes: UploadType[] = [];
  @Input() uploadType: UploadType;
  @Output() clicked: EventEmitter<boolean> = new EventEmitter();
  @Output() onClose: EventEmitter<boolean> = new EventEmitter();

  constructor(public service: UploadFileService) {
    this.acceptedTypes = this.service.acceptedTypes;
  }

  onClick() {
    this.clicked.emit(true);
  }

  close() {
    this.onClose.emit(false);
  }
}
