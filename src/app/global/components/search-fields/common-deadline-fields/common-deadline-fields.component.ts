import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { ProcessService } from 'app/modules/process/services/process.service';
import { MatDialog } from '@angular/material/dialog';
import { SearchProcessService } from '../search-fields.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from 'app/shared/date-picker-formats';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { GetLawyer } from 'app/modules/lawyer/model/lawyer.model';
import { DateTime } from 'luxon';
import { DeadlineStatus } from '../search-fields.model';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import { DeadlineTrackerTypeService } from 'app/modules/deadline-trackers/deadline-tracker-types.service';
import { DeadlineTrackerSubTypeService } from 'app/modules/deadline-trackers/deadline-tracker-subtypes.service';
import { IDeadlineTrackerSubTypes } from 'app/modules/deadline-trackers/model/deadline-tracker-subtype.model';
import { MatSelectChange } from '@angular/material/select';
import { LocalCore } from 'app/modules/cores/model/get-core';

@Component({
  selector: 'search-deadline',
  templateUrl: './common-deadline-fields.components.html',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class CommonDeadlineFieldsComponent {
  @Input() displayControls: string[] = [];
  @Output() changedForm: EventEmitter<{
    name: string;
    value: string;
    id?: number;
  }> = new EventEmitter();
  insideLaywers: GetLawyer[] = [];
  deadlineTypes = [];
  deadlineSubTypes = [];
  get form() {
    return this.searchProcess.filtersForm;
  }

  get rangeDate() {
    return this.searchProcess.filtersForm.controls['rangeDate'];
  }

  get rangeDateInternDeadline() {
    return this.searchProcess.filtersForm.controls['rangeDateInternDeadline'];
  }

  get status() {
    return Object.values(DeadlineStatus);
  }

  constructor(
    private typesService: DeadlineTrackerTypeService,
    private subTypeService: DeadlineTrackerSubTypeService,
    public dialog: MatDialog,
    private searchProcess: SearchProcessService,
    private lawyerService: LawyerService,
    private coreService: CoreService,
  ) {}

  ngOnInit() {
    this.getLawyers();
    this.getDeadlineTypes();
  }

  get core(): LocalCore {
    return this.coreService.localCore;
  }

  rangeDateChange(controlName: string, rangeType: string) {
    const date = <DateTime>this.form.controls[rangeType].get(controlName).value;
    if (!date) return;
    const isoDate = date.toUTC().set({ hour: 0 }).toISO();
    this.changedForm.emit({
      value: isoDate,
      name: controlName,
    });
  }

  resetDate(rangeType: string) {
    this.searchProcess.filtersForm.controls[rangeType].reset();
  }

  private getLawyers() {
    if(!this.core?.id) return;
    this.lawyerService.findAllInsideLawyersByCore(this.core.id).subscribe({
      next: (res) => {
        this.insideLaywers = res;
      },
    });
  }

  private getDeadlineTypes() {
    this.typesService.findAll().subscribe({
      next: (res) => {
        this.deadlineTypes = res;
      },
    });
  }

  deadlineTypeChanged(event: MatSelectChange) {
    if (event.value == '--Selecione--') return;
    this.findSubTypesByType(event.value);
  }

  private findSubTypesByType(typeId: number) {
    this.subTypeService
      .findAll([], 'type', typeId)
      .subscribe((res: IDeadlineTrackerSubTypes[]) => {
        this.deadlineSubTypes = res;
      });
  }

}
