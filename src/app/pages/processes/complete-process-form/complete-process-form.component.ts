import { AfterViewInit, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FinishedProcess } from '../../../modules/finished_process/model/finished_process.model';
import { FinishedProcessService } from 'app/modules/finished_process/finished_process.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { GlDialogComponent } from '@components/gl-dialog/gl-dialog.component';
import { ProcessService } from 'app/modules/process/services/process.service';

@Component({
  selector: 'complete-process-form',
  templateUrl: './complete-process-form.component.html',
  styleUrls: ['./complete-process-form.component.scss'],
})
export class CompleteProcessFormComponent implements AfterViewInit {
  id: number | null;
  form: FormGroup = new FormGroup({
    canBeEndded: new FormControl([Validators.required]),
    waitToAuthorizaded: new FormControl([Validators.required]),
    type: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    observation: new FormControl('', [Validators.required]),
  });

  types: any[] = ['encerramento 1', 'encerramento 2'];
  isReadOnly: boolean = false;

  constructor(
    private finishedProcess: FinishedProcessService,
    @Inject(MAT_DIALOG_DATA)
    public data: { processId: number; isEdit: boolean },
    private notification: NotificationService,
    private mdDialogRef: MatDialogRef<GlDialogComponent>,
    private processService: ProcessService,
  ) {}

  findFinishedProcess() {
    if (!this.data.isEdit) return;
    this.finishedProcess.findOne(this.data.processId).subscribe({
      next: (data) => {
        if (!data) return;
        this.id = data.id;
        this.form.patchValue({
          ...data,
        });
        this.isReadOnly = true
      },
    });
  }

  ngAfterViewInit() {
    this.isReadOnly = false;
    setTimeout(() => {
      this.findFinishedProcess();
    }, 0);
  }

  btnClicked(event: boolean) {
    if (!event) return;
    if (!this.form.valid) return;
    const { date, ...rest } = this.form.value;
    const newDate = new Date(date).toISOString();
    const sendForm: FinishedProcess = {
      ...rest,
      date: newDate,
    };
    this.id ? this.update(sendForm) : this.create(sendForm);
  }

  create(form: FinishedProcess) {
    this.finishedProcess.create(form, this.data.processId).subscribe({
      next: () => {
        this.notification.success('Conclusão criada com sucesso');
        this.updateProcessStatus();
      },
    });
  }

  update(form: FinishedProcess) {
    const obj = { ...form, id: this.id };
    this.finishedProcess.update(obj).subscribe({
      next: () => {
        this.notification.success('Conclusão alterada com sucesso');
        this.updateProcessStatus();
      },
    });
  }

  updateProcessStatus() {
    this.processService.getProcessById(this.data.processId).subscribe({
      next: (process) => {
        this.processService.updateProcessMemory(process);
        this.mdDialogRef.close();
      },
    });
  }
}
