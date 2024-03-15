import {
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { processFields } from 'app/modules/process/process-fields';

@Component({
  selector: 'exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.scss'],
})
export class ExporterComponent {
  @ViewChild('filterInput') filterInput;
  status: { name: string; value: string };
  insideLawyer: { name: string; value: string };
  startDate: { name: string; value: string };
  endDate: { name: string; value: string };
  filterProcessFields: { name: string; label: string }[] = [];
  processFields: { name: string; label: string }[] = processFields.sort(
    (a, b) => a.label.localeCompare(b.label),
  );

  constructor(private cdr: ChangeDetectorRef) {
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

  selectProcessField(event: MatAutocompleteSelectedEvent) {
    this.processFields = processFields
    const field = event.option.value;

    const existField = this.processFields.find((f) => f.name == field);
    if (!existField) return;

    const haveField = this.filterProcessFields.some((f) => f.name == field);
    if (haveField) return;

    this.filterProcessFields.push(existField);
    this.filterInput.nativeElement.value = ''
  }

  filterField(event: any) {
    const query = event.target.value.toLowerCase();
    this.processFields = processFields.filter((role) =>
      role.label.toLowerCase().includes(query),
    );
  }

  
}
