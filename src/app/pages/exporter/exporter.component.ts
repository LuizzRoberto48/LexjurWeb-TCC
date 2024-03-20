import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { getEnumKeyByEnumValue } from 'app/global/utils/str-manipulations';
import { ExportProcess } from 'app/modules/process/models/export-process';
import { ProcessStatus } from 'app/modules/process/models/process.model';
import { processFields } from 'app/modules/process/process-fields';
import { ExportProcessService } from 'app/modules/process/services/export-process.service';

@Component({
  selector: 'exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.scss'],
})
export class ExporterComponent {
  @ViewChild('filterInput') filterInput;
  status: { name: string; value: string };
  insideLawyer: { id?: number; name: string; value: string };
  startDate: { name: string; value: string };
  endDate: { name: string; value: string };
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
    if (this.status?.name || this.insideLawyer?.id || this.endDate?.value)
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
      ...(this.insideLawyer?.id && { insideLawyer: this.insideLawyer.id }),
      ...(this.status?.value && {
        status: getEnumKeyByEnumValue(ProcessStatus, this.status.value),
      }),
      ...(this.startDate?.value &&
        this.endDate?.value && {
          rangeDate: {
            start: this.startDate.value,
            end: this.endDate.value,
          },
        }),
      columns: this.filterProcessFields,
    };
    this.exportService.exportExcel(body).subscribe({
      next: (res: any) => {
        const { blob, filename } =
          this.exportService.transformResponseToBlob(res);
        this.exportService.saveFile(blob, filename);
      },
    });
  }
}
