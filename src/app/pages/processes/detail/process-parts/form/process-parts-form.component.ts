import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlDialogComponent } from '@components/gl-dialog/gl-dialog.component';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { GetProcessParts } from 'app/modules/process-parts/dto/process-parts.dto';
import { ProcessPartsService } from 'app/modules/process-parts/process-parts.service';
import { PersonType } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/process.service';

@Component({
  selector: 'process-parts-form',
  templateUrl: './process-parts-form.component.html',
  styleUrls: ['./process-parts-form.component.scss'],
})
export class ProcessPartsFormComponent {
  positions: string[] = [];
  editParts: GetProcessParts = {} as GetProcessParts;
  form: FormGroup = new FormGroup({
    processId: new FormControl('', { validators: [Validators.required] }),
    id: new FormControl(null),
    name: new FormControl('', { validators: [Validators.required] }),
    personType: new FormControl(PersonType.FISICA, {
      validators: [Validators.required],
    }),
    position: new FormControl('', { validators: [Validators.required] }),
  });

  constructor(
    private processService: ProcessService,
    @Inject(MAT_DIALOG_DATA)
    public data: { processId: number; id: number; parts?: GetProcessParts },
    private partsService: ProcessPartsService,
    private mdDialogRef: MatDialogRef<GlDialogComponent>,
    private notification: NotificationService,
  ) {
    this.form.controls['processId'].setValue(this.data?.processId);
    this.form.controls['id'].setValue(this.data?.id);
    this.isEdit();
    this.getPositions();
  }

  isEdit() {
    if (this.data.id) {
      this.editParts = this.data.parts;
      this.form.patchValue({ ...this.data.parts });
    }
  }

  private getPositions() {
    this.processService.findStakeholdersPositions().subscribe({
      next: (res) => {
        this.positions = res;
      },
    });
  }

  get personType() {
    return Object.values(PersonType);
  }

  btnClicked(event: boolean) {
    if (!event) return;
    if (!this.form.valid) return;
    this.data?.id ? this.update() : this.create();
  }

  create() {
    this.partsService.create(this.form.value).subscribe(() => {
      this.mdDialogRef.close(true);
      this.notification.success('Parte criada com sucesso');
    });
  }

  update() {
    this.partsService.update(this.form.value).subscribe(() => {
      this.mdDialogRef.close(true);
      this.notification.success('Parte modificada com sucesso');
    });
  }
}
