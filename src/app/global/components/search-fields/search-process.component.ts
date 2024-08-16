import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { Observable, Subscription } from 'rxjs';
import { LocalCore } from 'app/modules/cores/model/get-core';
import { SearchModalListComponent } from '../../../modules/process/components/search-process-list/search-modal-list.component';
import { MatDialog } from '@angular/material/dialog';
import { ProcessService } from '../../../modules/process/services/process.service';
import { SearchProcessService } from './search-fields.service';
import { EMPTYSELECT, SearchFieldsTypes } from './search-fields.model';

@Component({
  selector: 'search-process',
  templateUrl: './search-process.component.html',
  styleUrls: ['./search-process.component.scss'],
})
export class SearchProcessNewComponent implements OnInit {
  @Output() emitSearchValue: EventEmitter<{ name: string; value: string }> =
    new EventEmitter();
  @Output() emitSearchList: EventEmitter<{ name: string; value: string }[]> =
    new EventEmitter();
  searchList: { id?: number; name: string; value: string }[] = [];

  @Input() title = 'Buscar Processos';
  @Input() isExpandable = true;
  @Input() hasFilterBtn = false;
  @Input() filterBtnText = 'Filtrar';
  @Input() displayControls: string[] = [];
  @Input() searchType: SearchFieldsTypes = 'process';

  status!: { name: string; label: string };

  $subs: Subscription[] = [];

  constructor(
    private processService: ProcessService,
    private coreService: CoreService,
    public dialog: MatDialog,
    private searchProcess: SearchProcessService,
  ) {}

  get core(): LocalCore {
    return this.coreService.localCore;
  }

  get process(): Observable<any> {
    return this.processService.$obsevableProcess;
  }

  get form() {
    return this.searchProcess.filtersForm;
  }

  ngOnInit(): void {
    this.changeFields();
  }

  changeFields() {
    this.form.valueChanges.subscribe({
      next: (values) => {
        const filteredValues = Object.keys(values)
          .filter(
            (key) => values[key] !== '--Selecione--' && values[key] !== '',
          )
          .map((key) => ({
            name: key,
            value: values[key],
          }));
        this.searchList = []
        filteredValues.map(value => this.onChangedCommonForm(value))
      },
    });
  }

  onChangedCommonForm(event: { value: string; name: string }) {
    if (event.name === 'id') {
      this.searchList = [event];
      this.emitSearchValue.emit(event);
      return;
    }
    this.searchList.push(event);
    this.emitSearchValue.emit(event);
  }

  sendFilters() {
    this.emitSearchList.emit(this.searchList);
  }

  openDialog(processes) {
    this.dialog.open(SearchModalListComponent, {
      data: processes,
      minWidth: '40vw',
      minHeight: '30wh',
    });
  }

  ngOnDestroy() {
    this.$subs.forEach((s) => s.unsubscribe());
  }
}
