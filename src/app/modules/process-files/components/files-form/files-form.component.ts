import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
import { Subscription, switchMap, tap } from 'rxjs';
import { UploadFileService } from '@components/upload-file/upload-file.service';
import { DeadlineProcessWithResources } from 'app/modules/resource/model/resource.model';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from 'app/shared/date-picker-formats';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'files-form',
  templateUrl: './files-form.component.html',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class FilesFormComponent implements OnInit {
  
  @Input() uploadFile: GetUploadFile;
  @Input() processId: number;
  @Input() text = 'Adicione um arquivo';

  processWithResources: DeadlineProcessWithResources[] = [];
  classifications: { id: number; name: string }[] = [];
  types: TargetFiles[] = [];
  fileType = {} as { type: UploadType; file?: File };
  currentFile: File;
  urlFile: string;
  $subsFile: Subscription = new Subscription();
  $subsBucket: Subscription = new Subscription();
  form: FormGroup;
  isEdit: boolean = false;
  subs: Subscription[] = [];
  isLoading: boolean = false;
  isFinished = false;

  constructor(
    private dTrackerService: DeadlineTrackerService,
    public uploadService: UploadProcessFileService,
    private notificationService: NotificationService,
    private cd: ChangeDetectorRef,
    public dialogRef:MatDialogRef<any>,
    private notification: NotificationService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      uploadFile: GetUploadFile;
      processId: number;
      text?: string;
    },
  ) {}

  ngOnInit() {
    this.uploadFile = this.data.uploadFile;
    this.processId = this.data.processId;
    this.text = this.data?.text || 'Adicione um arquivo'
    this.form = this.initForm;
    setTimeout(() => {
      this.findProcessResources();
      this.listClassifications();
      this.initFile();
      this.getEditProcessNumber();
      this.isFinishedFile();
    }, 0);
  }

  clearProcessValidator() {
    const control = this.form.get('processNumber');
    control.clearValidators();
    control.setValue('', { emitEvent: false });
    control.updateValueAndValidity({ emitEvent: false });
  }

  private isProcessControlEnabled() {
    if (!this.uploadService?.$currentProcessNumber) return;
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
        this.getEditProcessNumber();
        /* edit */
        if (file) {
          this.form.controls['id'].setValue(file.id);
          this.uploadFile = file;
          this.fileType.type = this.uploadService.findCardFile(this.uploadFile);
          this.objToForm();
          this.isEdit = true;
        } else {
          /* create */
          this.fileType.type = null;
          this.isEdit = false;
        }
        this.isProcessControlEnabled();
      },
    });
    this.subs.push(subs);
  }

  isFinishedFile() {
    const subs = this.uploadService.$isFinishedFile.subscribe({
      next: (data: boolean) => {
        this.isFinished = data;
      },
    });
    this.subs.push(subs);
  }

  getEditProcessNumber() {
    if (!this.uploadService?.$currentProcessNumber) return;
    this.uploadService?.$currentProcessNumber.subscribe((processNumber) => {
      this.form.get('processNumber').setValue(processNumber);
    });
  }

  objToForm() {
    this.form.patchValue({
      ...this.uploadFile,
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
    });
  }

  changeFile(obj: { file: File; type: UploadType }) {
    this.fileType = obj;
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
          this.dialogRef.close()
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
  }

  send() {
    if (!this.fileType.file && !this.isEdit) {
      this.notificationService.danger('Adicione um arquivo para envio');
      return;
    }
    this.isLoading = true;
    const formValue = this.form.getRawValue();
    const sendObj = this.formToObj(formValue);
    
    if (formValue?.id) {
      this.updateFile(sendObj);
      this.dialogRef.close({file:sendObj, method:'update'})
      return;
    }
    this.createFile(sendObj);
    this.dialogRef.close({file:sendObj, method:'create'})
  }

  clickCloseIcon() {
    this.dialogRef.close({file:null, method:'update'})
  }

  private createFile(obj: CreateUploadProcessFile) {
    const { id, ...sendObj } = obj;
    sendObj.isFinished = this.isFinished;
    this.uploadService.createFile(this.fileType.file, sendObj).subscribe({
      next: (data) => {
        this.uploadService.$crudFile.next({ file: data, method: 'create' });
        this.form.reset();
        this.currentFile = null;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  private updateFile(obj: CreateUploadProcessFile) {
    this.uploadService.updateFile(obj, this.fileType?.file).subscribe({
      next: (data) => {
        this.notification.success('Arquivo alterado com sucesso');
        this.uploadService.$crudFile.next({ file: data, method: 'update' });
        this.form.reset();
        this.currentFile = null;
      },
      complete: () => {
        this.isLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  private formToObj(form: FormUploadProcessFile): CreateUploadProcessFile {
    const { processNumber, createAt, ...deadlineForm } = form;
    let isoDate = createAt;
    if (createAt instanceof DateTime) {
      isoDate = createAt.toUTC().toISO();
    }
    const pwrObj = this.processWithResources.find(
      (p) => p.number == processNumber,
    );

    const obj: CreateUploadProcessFile = {
      ...deadlineForm,
      processNumber: pwrObj,
      createAt: isoDate,
    };
    if (!obj.processNumber) delete obj.processNumber;
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
