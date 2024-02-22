import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlDialogComponent } from '@components/gl-dialog/gl-dialog.component';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { GetProcessParts } from 'app/modules/process-parts/dto/process-parts.dto';
import { ProcessRequestsService } from 'app/modules/process-requests/process-requests.service';
import { ProcessService } from 'app/modules/process/process.service';
import { LossProbabilityEnum } from 'app/modules/process-files/models/upload-process-files';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { MY_FORMATS } from 'app/shared/date-picker-formats';
import { GetProcessRequest } from 'app/modules/process-requests/model/process-requests.model';
import { DateTime } from 'luxon';
@Component({
  selector: 'process-requests-form',
  templateUrl: './process-requests-form.component.html',
  styleUrls: ['./process-requests-form.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class ProcessRequestsFormComponent {
  requests: string[] = [];
  editRequests: GetProcessRequest = {} as GetProcessRequest;
  form: FormGroup = new FormGroup({
    processId: new FormControl('', { validators: [Validators.required] }),
    id: new FormControl(null),
    request: new FormControl('', { validators: [Validators.required] }),
    date: new FormControl('', {
      validators: [Validators.required],
    }),
    lossProbability: new FormControl('', { validators: [Validators.required] }),
    value: new FormControl('', { validators: [Validators.required] }),
    provisionedValue: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { processId: number; id: number; request?: GetProcessRequest },
    private requestsService: ProcessRequestsService,
    private mdDialogRef: MatDialogRef<GlDialogComponent>,
    private notification: NotificationService,
  ) {
    this.form.controls['processId'].setValue(this.data?.processId);
    this.form.controls['id'].setValue(this.data?.id);
    this.isEdit();
    this.getRequests();
  }

  isEdit() {
    if (this.data.id) {
      this.form.patchValue({
        ...this.data.request,
      });
    }
  }

  private getRequests() {
    this.requestsService.findRequestTypes().subscribe({
      next: (res) => {
        this.requests = res;
      },
    });
  }

  get lossProbability() {
    return Object.values(LossProbabilityEnum);
  }

  btnClicked(event: boolean) {
    if (!event) return;
    if (!this.form.valid) return;
    this.data?.id ? this.update() : this.create();
  }

  create() {
    const { id, ...rest } = this.form.value;
    this.requestsService.create(rest).subscribe(() => {
      this.mdDialogRef.close(true);
      this.notification.success('Pedido criado com sucesso');
    });
  }

  update() {
    this.requestsService.update(this.form.value).subscribe(() => {
      this.mdDialogRef.close(true);
      this.notification.success('Pedido modificado com sucesso');
    });
  }
}
