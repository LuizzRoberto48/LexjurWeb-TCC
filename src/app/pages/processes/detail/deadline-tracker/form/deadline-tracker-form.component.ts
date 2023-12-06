import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlDialogComponent } from '@components/gl-dialog/gl-dialog.component';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { CustomValidators } from 'app/global/forms/custom-validators';
import { LocalCore } from 'app/modules/cores/model/get-core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { DeadlineTrackerSubTypeService } from 'app/modules/deadline-trackers/deadline-tracker-subtypes.service';
import { DeadlineTrackerTypeService } from 'app/modules/deadline-trackers/deadline-tracker-types.service';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { IDeadlineTrackerSubTypes } from 'app/modules/deadline-trackers/model/deadline-tracker-subtype.model';
import { IDeadlineTrackerTypes } from 'app/modules/deadline-trackers/model/deadline-tracker-type.model';
import {
  CreateDeadlineTracker,
  DeadlineProcessWithResources,
  IDeadlineTracker,
} from 'app/modules/deadline-trackers/model/deadline-tracker.model';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import { BasicLawyer } from 'app/modules/lawyer/model/lawyer.model';
import { DateTime } from 'luxon';
import { switchMap } from 'rxjs';

const DEADLINE = 'Prazo';
const AUDIENCE = 'Audiência';
@Component({
  selector: 'schedule-form',
  templateUrl: './deadline-tracker-form.component.html',
})
export class DeadlineTrackerFormComponent implements OnInit {
  dialogTitle: string = 'Cadastre um prazo para o seu processo';
  types: IDeadlineTrackerTypes[] = [];
  subTypes: IDeadlineTrackerSubTypes[] = [];
  processWithResources: DeadlineProcessWithResources[] = [];
  coreId: number;
  laywers: BasicLawyer[] = [];
  isDeadline = false;
  isAudience = false;

  /* internDateMessage!: string; */
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    processId: new FormControl(null),
    processNumber: new FormControl('', { validators: [Validators.required] }),
    subType: new FormControl('', {
      validators: [Validators.required],
    }),
    manager: new FormControl('', { validators: [Validators.required] }),
    internalDeadline: new FormControl('', {
      validators: [Validators.required],
    }),
    criticalDeadline: new FormControl(''),
    type: new FormControl('', { validators: [Validators.required] }),
    hour: new FormControl(null),
    local: new FormControl(''),
    note: new FormControl(''),
  });

  constructor(
    private typeService: DeadlineTrackerTypeService,
    private dTrackerService: DeadlineTrackerService,
    private subTypeService: DeadlineTrackerSubTypeService,
    private lawyerService: LawyerService,
    private coreService: CoreService,
    private notification: NotificationService,
    private mdDialogRef: MatDialogRef<GlDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { processId; editObj: IDeadlineTracker },
  ) {
    this.findTypes();
    this.findProcessResources();
    this.findLawyersByCore();
  }

  isEdit(): boolean {
    return this.data?.editObj?.id ? true : false;
  }

  ngOnInit() {
    this.form.get('processId').setValue(this.data.processId);
    if (this.isEdit()) this.populateForm();
  }

  private findTypes() {
    this.typeService.findAll().subscribe((res: IDeadlineTrackerTypes[]) => {
      this.types = res;
    });
  }

  populateForm() {
    const type = this.data?.editObj.deadlineTrackerSubType.deadlineTrackerType;
    this.form.get('id').setValue(this.data.editObj?.id ?? null);
    this.objToForm(this.data?.editObj);
    this.selectDeadline(type);
    this.selectAudience(type);
    this.findSubTypesByType(type.id);
  }

  changeType() {
    const typeId = this.form.get('type').value;
    const deadlineOpt = this.types.find((type) => type.id === typeId);
    const audienceOpt = this.types.find((type) => type.id === typeId);
    this.form.get('subType').setValue('');
    this.clear();
    this.selectDeadline(deadlineOpt);
    this.selectAudience(audienceOpt);
    this.findSubTypesByType(typeId);
  }

  selectDeadline(deadlineOpt: IDeadlineTrackerTypes) {
    if (deadlineOpt?.label == DEADLINE) {
      this.isDeadline = true;
      this.deadlineValidator();
    }
  }

  selectAudience(deadlineOpt: IDeadlineTrackerTypes) {
    if (deadlineOpt?.label == AUDIENCE) {
      this.isAudience = true;
      this.audienceValidator();
    }
  }

  private clear() {
    this.isDeadline = false;
    this.isAudience = false;
    this.form.get('criticalDeadline')?.clearValidators();
    this.form.get('hour')?.clearValidators();
    this.updateValidatorDeadlineDates();
  }

  getInternErrorMessage() {
    const erros =
      this.form.get('internalDeadline').errors ||
      this.form.get('criticalDeadline').errors;
    const internDateValue = this.form.get('internalDeadline')?.value;
    const criticalDateValue = this.form.get('criticalDeadline')?.value || '';

    /* this.internDateMessage = undefined; */
    if (erros && erros['required']) {
      this.form
        .get('internalDeadline')
        .setErrors({ compareDates: 'Campo obrigatório' });
      return;
    }
    const internDate = DateTime.fromFormat(internDateValue, 'yyyy-MM-dd');
    const criticalDate = DateTime.fromFormat(criticalDateValue, 'yyyy-MM-dd');

    if (internDate > criticalDate) {
      const erroMsg = 'Prazo interno deve ser menor que o prazo crítico';
      this.form.setErrors({ msg: erroMsg });
      this.form.get('internalDeadline').setErrors({ compareDates: erroMsg });
      return;
    }
    this.form.get('internalDeadline').setErrors(null);
  }

  private deadlineValidator() {
    this.form.get('criticalDeadline')?.setValidators([Validators.required]);
    this.updateValidatorDeadlineDates();
  }

  private updateValidatorDeadlineDates() {
    this.form.get('criticalDeadline')?.updateValueAndValidity();
    this.form.get('internalDeadline')?.updateValueAndValidity();
    this.form.get('hour')?.updateValueAndValidity();
  }

  private audienceValidator() {
    this.form.get('hour')?.setValidators([Validators.required]);
  }

  private findProcessResources() {
    this.dTrackerService
      .findProcessResources()
      .subscribe((res: DeadlineProcessWithResources[]) => {
        this.processWithResources = res;
      });
  }

  private findLawyersByCore() {
    return this.coreService.$obsevableCore
      .pipe(
        switchMap((core: LocalCore) => {
          return this.lawyerService.findLawyersByCore(core.id);
        }),
      )
      .subscribe((res: BasicLawyer[]) => {
        this.laywers = res;
      });
  }

  private findSubTypesByType(typeId: number) {
    this.subTypeService
      .findAll([], 'type', typeId)
      .subscribe((res: IDeadlineTrackerSubTypes[]) => {
        this.subTypes = res;
      });
  }

  btnClicked(event: any) {
    if (!event) return;
    const id = this.form.value['id'];
    if (this.form.invalid) {
      this.notification.danger(
        this.form.errors?.msg ?? 'formulário incompleto',
      );
      return;
    }
    if (event) id ? this.updateDeadlineTracker() : this.createDeadlineTracker();
  }

  private createDeadlineTracker() {
    const { id, ...obj } = this.form.value;
    const createObj = this.formToObj(obj);
    this.dTrackerService.create(createObj).subscribe({
      next: () => {
        this.mdDialogRef.close(true);
        this.notification.success('Prazo criado com sucesso');
      },
      error: (e) => {
        this.notification.danger('Formulário incorreto');
        console.error(e);
      },
    });
  }

  private formToObj(form): CreateDeadlineTracker {
    const { type, hour, criticalDeadline, processNumber, ...deadlineForm } =
      form;
    const internalDeadline = this.dTrackerService.internalDateWithHour(
      form.internalDeadline,
      hour,
    );
    const pwrObj = this.processWithResources.find(
      (p) => p.number == processNumber,
    );
    const criticalDate = DateTime.fromFormat(
      criticalDeadline,
      'yyyy-MM-dd',
    ).toISO();
    /* remove criticalDeadline property if type is not 'Prazo' */
    const isDeadline = this.types.some((t) => t.id === type.id);
    if (!isDeadline) {
      delete deadlineForm.criticalDeadline;
    }

    const obj: CreateDeadlineTracker = {
      ...deadlineForm,
      internalDeadline,
      criticalDeadline: criticalDate,
      processNumber: pwrObj,
    };
    return obj;
  }

  private objToForm(obj: IDeadlineTracker) {
    const number = obj?.resource ? obj.resource.number : obj.process.caseNumber;
    const time = DateTime.fromISO(obj.internalDeadline).toFormat('hh:mm');
    const criticalDate = obj.criticalDeadline
      ? DateTime.fromISO(obj.criticalDeadline).toFormat('yyyy-MM-dd')
      : '';
    this.form.patchValue({
      ...obj,
      manager: obj.manager.id,
      subType: obj.deadlineTrackerSubType.id,
      type: obj.deadlineTrackerSubType.deadlineTrackerType.id,
      processNumber: number,
      internalDeadline: DateTime.fromISO(obj.internalDeadline).toFormat(
        'yyyy-MM-dd',
      ),
      hour: time,
      criticalDeadline: criticalDate,
    });
  }

  private updateDeadlineTracker() {
    const obj = this.form.value;
    const updatedObj = this.formToObj(obj);
    this.dTrackerService.update(updatedObj).subscribe({
      next: () => {
        this.mdDialogRef.close(true);
        this.notification.success('Prazo criado com sucesso');
      },
      error: (e) => {
        this.notification.danger('Formulário incorreto');
        console.error(e);
      },
    });
  }
}
