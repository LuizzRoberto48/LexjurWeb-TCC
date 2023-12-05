import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'app/global/forms/custom-validators';
import { LocalCore } from 'app/modules/cores/model/get-core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { DeadlineTrackerSubTypeService } from 'app/modules/deadline-trackers/deadline-tracker-subtypes.service';
import { DeadlineTrackerTypeService } from 'app/modules/deadline-trackers/deadline-tracker-types.service';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { IDeadlineTrackerSubTypes } from 'app/modules/deadline-trackers/model/deadline-tracker-subtype.model';
import { IDeadlineTrackerTypes } from 'app/modules/deadline-trackers/model/deadline-tracker-type.model';
import { DeadlineProcessWithResources } from 'app/modules/deadline-trackers/model/deadline-tracker.model';
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
  internDateMessage!: string;
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    processNumber: new FormControl('', { validators: [Validators.required] }),
    subtype: new FormControl('', { validators: [Validators.required] }),
    manager: new FormControl('', { validators: [Validators.required] }),
    internDeadline: new FormControl('', { validators: [Validators.required] }),
    criticalDeadline: new FormControl(''),
    type: new FormControl('', { validators: [Validators.required] }),
    hour: new FormControl(''),
    local: new FormControl(''),
    note: new FormControl(''),
  });

  constructor(
    private typeService: DeadlineTrackerTypeService,
    private dTrackerService: DeadlineTrackerService,
    private subTypeService: DeadlineTrackerSubTypeService,
    private lawyerService: LawyerService,
    private coreService: CoreService,
  ) {
    this.findTypes();
    this.findProcessResources();
    this.findLawyersByCore();
  }

  ngOnInit() {
    this.form.get('note').setValue('')
  }

  private findTypes() {
    this.typeService.findAll().subscribe((res: IDeadlineTrackerTypes[]) => {
      this.types = res;
    });
  }

  changeType() {
    this.clear();
    const typeId = this.form.get('type').value;
    this.isDeadline = this.isDeadlineType(typeId);
    this.isAudience = this.isAudienceType(typeId);
    this.findSubTypesByType(typeId);
  }

  private clear() {
    this.isDeadline = false;
    this.isAudience = false;
    this.form.get('criticalDeadline')?.clearValidators();
    this.form.get('hour')?.clearValidators();
  }

  private isDeadlineType(typeId: number): boolean {
    const isDeadline = this.types.some(
      (type) => type.id === typeId && type.label === DEADLINE,
    );
    this.deadlineValidator(isDeadline);
    return isDeadline;
  }

  private isAudienceType(typeId: number): boolean {
    const isAudience = this.types.some(
      (type) => type.id === typeId && type.label === AUDIENCE,
    );
    this.audienceValidator(isAudience);
    return isAudience;
  }

  getInternErrorMessage() {
    const erros = this.form.get('internDeadline').errors;
    const internDateValue = this.form.get('internDeadline')?.value;
    const criticalDateValue = this.form.get('criticalDeadline')?.value;

    this.internDateMessage = undefined;
    if (erros && erros['required']) {
      this.internDateMessage = 'Campo obrigatório';
      return;
    }
    const internDate = DateTime.fromFormat(internDateValue, 'yyyy-MM-dd');
    const criticalDate = DateTime.fromFormat(criticalDateValue, 'yyyy-MM-dd');
    if (internDate > criticalDate) {
      this.form.get('internDeadline').setErrors({ compareDates: true });
      this.internDateMessage = 'Data deve ser menor que a crítica';
      return;
    }
    this.form.get('internDeadline').setErrors(null)
  }

  private deadlineValidator(isDeadline: boolean) {
    if (isDeadline) {
      this.form.get('criticalDeadline')?.setValidators([Validators.required]);
      this.updateValidatorDeadlineDates();
    }
  }

  private updateValidatorDeadlineDates() {
    this.form.get('criticalDeadline')?.updateValueAndValidity();
    this.form.get('internDeadline')?.updateValueAndValidity();
  }

  private audienceValidator(isAudience: boolean) {
    if (isAudience) this.form.get('hour')?.setValidators([Validators.required]);
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
    console.log(event);
  }
}
