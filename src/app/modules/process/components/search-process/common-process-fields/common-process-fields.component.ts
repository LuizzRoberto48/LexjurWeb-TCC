import { Component, EventEmitter, Output } from '@angular/core';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import { GetLawyer } from 'app/modules/lawyer/model/lawyer.model';
import { ProcessStatus } from 'app/modules/process/models/process.model';
import { SearchProcessService } from 'app/modules/process/services/search-process.service';
import { MY_FORMATS } from 'app/shared/date-picker-formats';
import { DateTime } from 'luxon';

@Component({
  selector: 'common-process-fields',
  templateUrl: './common-process-fields.component.html',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class CommonProcessFieldsComponent {
  @Output() changedForm: EventEmitter<{
    name: string;
    value: string;
    id?: number;
  }> = new EventEmitter();

  insideLaywers: GetLawyer[] = [];
  constructor(
    private searchProcess: SearchProcessService,
    private lawyerService: LawyerService
  ) {
    this.getLawyers();
  }

  get rangeDate() {
    return this.searchProcess.filtersForm.controls['rangeDate']
  }

  get form() {
    return this.searchProcess.filtersForm;
  }

  get status() {
    return Object.values(ProcessStatus);
  }

  private getLawyers() {
    this.lawyerService.findAllInsideLawyers().subscribe({
      next: (res) => {
        this.insideLaywers = res;
      },
    });
  }
  
  rangeDateChange(controlName:string) {
    const date  = <DateTime>this.form.controls['rangeDate'].get(controlName).value;
    const isoDate = date.toUTC().toISO();
    this.changedForm.emit({
      value: isoDate,
      name: controlName,
    });
  }

  selectChanged(formValue: string, event: MatSelectChange, elToList: string) {
    const id = event.value;
    const element = this[elToList].find((el) => el?.id == id || el == id);
    this.changedForm.emit({
      id: element?.id,
      value: element?.name ?? element,
      name: formValue,
    });
  }
}
