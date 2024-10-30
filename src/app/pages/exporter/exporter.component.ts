import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { getEnumKeyByEnumValue } from 'app/global/utils/str-manipulations';
import { ExportProcess } from 'app/modules/process/models/export-process';
import { ProcessStatus } from 'app/modules/process/models/process.model';
import { processFields } from 'app/modules/process/process-fields';
import { ExportProcessService } from 'app/modules/process/services/export-process.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.scss'],
})
export class ExporterComponent {
  @ViewChild('filterInput') filterInput;
  processStatus: { name: string; value: string };
  insideLawyerId: { id?: number; name: string; value: string };
  rangeDate:{name:string, value:{endDate:DateTime, startDate:Date}}
  filterProcessFields: { name: string; label: string }[] = [];
  processFields: { name: string; label: string }[] = processFields.sort(
    (a, b) => a.label.localeCompare(b.label),
  );

  constructor(
    private cdr: ChangeDetectorRef,
    private exportService: ExportProcessService,
    private notificationService: NotificationService,
  ) {
    this.filterProcessFields = this.processFields;
  }

  searchValues(event: any) {
    this[event.name] = event;
  }

  removeProcessField(field: { name: string; value: string }) {
    this.filterProcessFields = this.filterProcessFields.filter(
      (f) => f.name != field.name,
    );
    this.cdr.detectChanges();
  }

  addAllProcessFields() {
    this.filterProcessFields = this.processFields;
  }
  removeAllProcessFields() {
    this.filterProcessFields = [];
  }

  isValidateBuildExcel(): boolean {
    if (this.processStatus?.name || this.insideLawyerId?.value || this.rangeDate?.value?.endDate)
      return true;

    return false;
  }

  selectProcessField(event: MatAutocompleteSelectedEvent) {
    this.processFields = processFields;
    const field = event.option.value;

    const existField = this.processFields.find((f) => f.name == field);
    if (!existField) return;

    const haveField = this.filterProcessFields.some((f) => f.name == field);
    if (haveField) return;

    this.filterProcessFields.push(existField);
    this.filterInput.nativeElement.value = '';
  }

  filterField(event: any) {
    const query = event.target.value.toLowerCase();
    this.processFields = processFields.filter((role) =>
      role.label.toLowerCase().includes(query),
    );
  }

  export() {
    if (!this.isValidateBuildExcel()) {
      this.notificationService.danger(
        'Você precisa adicionar ao menos um filtro para exportar os processos para excel.',
      );
      return;
    }
    const body: ExportProcess = {
      ...(this.insideLawyerId?.value && { insideLawyer: this.insideLawyerId?.value }),
      ...(this.processStatus?.value && {
        status: getEnumKeyByEnumValue(ProcessStatus, this.processStatus.value),
      }),
      ...(this.rangeDate?.value?.endDate && { startDate: this.rangeDate.value.startDate }),
      ...(this.rangeDate?.value?.endDate && { endDate: this.rangeDate.value.endDate }),
      columns: this.filterProcessFields,
    };
    
    this.exportService.exportExcel(body).subscribe({
      next: (res: any) => {
        const { blob, filename } =
          this.exportService.transformResponseToBlob(res);
        this.exportService.saveFile(blob, filename);
      }
    });
  }
}
