import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { Ufs } from 'app/global/utils/get-ufs';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import { GetLawyer } from 'app/modules/lawyer/model/lawyer.model';
import { ProcessStatus } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/services/process.service';
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
  @Input() displayControls: string[] = [];
  @Output() changedForm: EventEmitter<{
    name: string;
    value: string;
    id?: number;
  }> = new EventEmitter();

  insideLaywers: GetLawyer[] = [];
  clients = [];
  counties = [];
  ufs = [];
  constructor(
    private searchProcess: SearchProcessService,
    private lawyerService: LawyerService,
    private processService: ProcessService,
  ) {
    
  }

  ngAfterViewInit() {
    if (this.displayControls.includes('insideLawyerId')) this.getLawyers();
    if (this.displayControls.includes('uf')) this.getUfs();
    if (this.displayControls.includes('client')) this.findClients();
  }

  get rangeDate() {
    return this.searchProcess.filtersForm.controls['rangeDate'];
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

  rangeDateChange(controlName: string) {
    const date = <DateTime>(
      this.form.controls['rangeDate'].get(controlName).value
    );
    if (!date) return;
    const isoDate = date.toUTC().set({ hour: 0 }).toISO();
    this.changedForm.emit({
      value: isoDate,
      name: controlName,
    });
  }

  selectChanged(formValue: string, event, elToList: string) {
    const element = this[elToList].find(
      (el) => el?.id == event || el == event || el?.name == event,
    );
    this.changedForm.emit({
      id: element?.id,
      value: element?.name ?? element,
      name: formValue,
    });
  }

  changedId(formValue: string) {
    this.changedInput(formValue);
    this.searchProcess.changedId();
  }

  changedInput(formValue: string) {
    this.changedForm.emit({
      value: this.form.get(formValue).value,
      name: formValue,
    });
  }

  findClients() {
    this.processService.findClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
    });
  }

  changeUfs() {
    const ufName = this.searchProcess.filtersForm.get('uf').value;
    this.selectChanged('uf', ufName, 'ufs');
    this.getCountyByUf(ufName);
  }

  private getUfs() {
    this.ufs = Ufs;
  }

  private getCountyByUf(ufId: string) {
    if (!ufId) return;
    this.processService.findCountiesByUf(ufId).subscribe({
      next: (res) => {
        this.counties = res;
      },
    });
  }

  ngOnDestroy() {
    this.searchProcess.filtersForm.reset();
  }
}
