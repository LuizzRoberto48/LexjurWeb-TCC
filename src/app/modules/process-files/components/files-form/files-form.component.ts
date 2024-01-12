import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UploadType } from '@components/upload-file/upload.model';

import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';

import {
  GetUploadFile,
  TargetFiles,
  CreateUploadProcessFile,
  FormUploadProcessFile,
} from '../../models/upload-process-files';
import { UploadProcessFileService } from '../../services/upload-process.service';
import { DateTime } from 'luxon';
import { blobToFile } from '../../../../global/utils/file.manipulations';
import { Subscription } from 'rxjs';
import { UploadFileService } from '@components/upload-file/upload-file.service';
import { ALL } from '../files-list/files-list.component';
import { DeadlineProcessWithResources } from 'app/modules/resource/model/resource.model';
import { NotificationService } from '@fuse/components/notification/notification.service';

const lossProbability = ['Possível', 'Provável', 'Remota'];
@Component({
  selector: 'files-form',
  templateUrl: './files-form.component.html',
})
export class FilesFormComponent implements OnInit {
  @Output() onClose: EventEmitter<boolean> = new EventEmitter();
  @Input() uploadFile: GetUploadFile;
  @Input() processId: number;

  processWithResources: DeadlineProcessWithResources[] = [];
  classifications: { id: number; name: string }[] = [];
  lossProbabilities = lossProbability;
  types: TargetFiles[] = [];

  fileType: { file: File; type: UploadType } = {} as any;
  currentFile: File;
  urlFile: string;
  $subsFile: Subscription = new Subscription();
  $subsBucket: Subscription = new Subscription();
  form: FormGroup;
  isEdit: boolean = false;
  subs: Subscription[] = [];

  constructor(
    private dTrackerService: DeadlineTrackerService,
    public uploadService: UploadProcessFileService,
    private fileService: UploadFileService,
    private notificationService: NotificationService,
  ) {
    this.form = this.initForm;
  }

  ngOnInit() {
    this.form = this.initForm;
    this.findProcessResources();
    this.listClassifications();
    this.initFile();
    this.getProcessNumber();
  }

  clearProcessValidator() {
    const control = this.form.get('processNumber');
    control.clearValidators();
    control.setValue('', { emitEvent: false });
    control.updateValueAndValidity({ emitEvent: false });
  }

  private isProcessControlEnabled() {
    /* Se existir target enviado da listagem ou os tipos forem iguais a processo ou recurso*/
    const hasProcessDisable =
      this.uploadFile?.target != TargetFiles.PROCESSO &&
      this.uploadFile?.target != TargetFiles.RECURSO;

    hasProcessDisable
      ? this.form.controls['processNumber'].disable({ onlySelf: true })
      : this.form.controls['processNumber'].enable({ onlySelf: true });
  }

  initFile() {
    const subs = this.uploadService.$obsevableFile.subscribe({
      next: (file: GetUploadFile) => {
        this.form.controls['processId'].setValue(this.processId);
        /* edit */
        if (file) {
          this.form.controls['id'].setValue(file.id);
          this.uploadFile = file;
          this.objToForm();
          this.isEdit = true;
        } else {
          /* create */
          this.currentFile = null;
          this.fileType = null;
          this.isEdit = false;
        }
        this.getProcessNumber();
        this.isProcessControlEnabled();
      },
    });
    this.subs.push(subs);
  }

  getProcessNumber() {
    if (!this.uploadService?.$currentProcessNumber) return;
    this.uploadService?.$currentProcessNumber.subscribe((processNumber) => {
      this.form.get('processNumber').setValue(processNumber);
    });
  }

  downloadFile() {
    if (!this.uploadFile) return;
    this.fileService.makeDownload(this.urlFile);
  }

  objToForm() {
    this.getFileFromBucket();
    this.form.patchValue({
      ...this.uploadFile,
      createAt: DateTime.fromISO(this.uploadFile.createAt).toFormat(
        'yyyy-MM-dd',
      ),
    });
    this.setProcessNumberFromEdit();
  }

  setProcessNumberFromEdit() {
    const number = this.uploadFile?.resource
      ? this.uploadFile.resource.number
      : this.findProcessTarget();
    this.form.patchValue({ processNumber: number });
  }

  findProcessTarget() {
    const process = this.processWithResources.find(
      (pwr) => pwr.id == this.processId,
    );
    if (process) return process.number;
  }

  get initForm() {
    return new FormGroup({
      id: new FormControl(null),
      processId: new FormControl(null),
      processNumber: new FormControl('', { validators: [Validators.required] }),
      fileClassificationId: new FormControl('', {
        validators: [Validators.required],
      }),
      createAt: new FormControl('', { validators: [Validators.required] }),
      lossProbability: new FormControl('', {
        validators: [Validators.required],
      }),
    });
  }

  setFile(obj: { file: File; type: UploadType }) {
    this.fileType = obj;
  }

  getFileFromBucket() {
    const fileProperties = this.uploadService.findCardFile(this.uploadFile);
    const subs = this.uploadService
      .downloadFile(this.uploadFile.bucketKey)
      .subscribe((res: any) => {
        this.urlFile = res.url;
        const blob = new Blob([res.url], { type: fileProperties.accept });
        const file: File = blobToFile(blob, this.uploadFile.originalName);
        this.setFile({ file, type: fileProperties });
        this.currentFile = file;
      });

    this.subs.push(subs);
  }

  removeFile() {
    if (!this.uploadFile?.id) return;
    const subs = this.uploadService
      .removeProcessFile(this.uploadFile.id)
      .subscribe({
        next: () => {
          this.notificationService.success('Arquivo removido com sucesso');
          this.uploadService.$crudFile.next({
            file: this.uploadFile,
            method: 'delete',
          });
          this.form.reset();
          this.currentFile = null;
        },
      });
    this.subs.push(subs);
  }

  private findProcessResources() {
    const subs = this.dTrackerService
      .findProcessResources()
      .subscribe((res: DeadlineProcessWithResources[]) => {
        this.processWithResources = res;
      });

    this.subs.push(subs);
  }

  listClassifications() {
    const subs = this.uploadService.findClassifications().subscribe((res) => {
      this.classifications = res;
    });
    this.subs.push(subs);
  }

  close() {
    this.currentFile = null;
    this.form.reset();
    this.form.clearValidators();
    this.onClose.emit(false);
  }

  send() {
    const formValue = this.form.getRawValue();
  
    const sendObj = this.formToObj(formValue);
    if (formValue?.id) {
      this.updateFile(sendObj);
      return;
    }
    this.createFile(sendObj);
  }

  private createFile(obj: CreateUploadProcessFile) {
    const { id, ...sendObj } = obj;
    this.uploadService.createFile(this.fileType.file, sendObj).subscribe({
      next: (data) => {
        this.uploadService.$crudFile.next({ file: data, method: 'create' });
        this.form.reset();
        this.currentFile = null;
      },
    });
  }

  private updateFile(obj: CreateUploadProcessFile) {
    this.uploadService.updateFile(this.fileType.file, obj).subscribe({
      next: (data) => {
        this.uploadService.$crudFile.next({ file: data, method: 'update' });
        this.form.reset();
        this.currentFile = null;
      },
    });
  }

  private formToObj(form: FormUploadProcessFile): CreateUploadProcessFile {
    const { processNumber, ...deadlineForm } = form;
    const pwrObj = this.processWithResources.find(
      (p) => p.number == processNumber,
    );
      console.log(form)
    const obj: CreateUploadProcessFile = {
      ...deadlineForm,
      processNumber: pwrObj,
    };
    if (!obj.processNumber) delete obj.processNumber;
    console.log(obj)
    /* Logica para processo e recurso é diferente do resto */
    if (!this.hasTarget()) {
      obj.targetId = pwrObj.id;
      obj.target = pwrObj.name;
    } else {
      obj.targetId = this.uploadService.currentTarget.id;
      obj.target = this.uploadService.currentTarget.name;
    }

    return obj;
  }

  hasTarget(): boolean {
    return !!this.uploadService.currentTarget?.name;
  }

  ngOnDestroy() {
    this.close();
    this.subs.forEach((s) => s.unsubscribe());
  }
}
