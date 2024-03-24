import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { Observable, Subscription } from 'rxjs';
import { LocalCore } from 'app/modules/cores/model/get-core';
import { SearchModalListComponent } from '../search-process-list/search-modal-list.component';
import { MatDialog } from '@angular/material/dialog';
import { ProcessService } from '../../services/process.service';
import { SearchProcessService } from '../../services/search-process.service';

@Component({
  selector: 'search-process',
  templateUrl: './search-process.component.html',
  styleUrls: ['./search-process.component.scss'],
})
export class SearchProcessNewComponent {
  @Output() emitSearchValue: EventEmitter<{ name: string; value: string }> =
    new EventEmitter();
  @Output() emitSearchList: EventEmitter<{ name: string; value: string }[]> =
    new EventEmitter();
  searchList: { id?: number; name: string; value: string }[] = [];

  @Input() title = 'Buscar Processos';
  @Input() isAppendProcessFilter = false;
  @Input() isExpandable = true;
  @Input() hasFilterBtn = false;
  @Input() filterBtnText = 'Filtrar';
  @Input() displayControls: string[] = [];

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

  onChangedCommonForm(event: { id?: number; value: string; name: string }) {
    if (event.name === 'id') {
      this.searchList = [event];
      return
    }
    // Remove the old element with the same name if it exists
    this.searchList = this.searchList.filter(
      (e) => e.name !== event.name && e.value !== '' && e.value !== null,
    );
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
