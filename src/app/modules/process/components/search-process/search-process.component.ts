import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { Observable, Subscription, forkJoin, of, switchMap } from 'rxjs';
import { LocalCore } from 'app/modules/cores/model/get-core';
import { SearchModalListComponent } from '../search-process-list/search-modal-list.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { ProcessService } from '../../services/process.service';
import { Process } from '../../models/process.model';
import { SearchProcessService } from '../../services/search-process.service';

@Component({
  selector: 'search-process',
  templateUrl: './search-process.component.html',
  styleUrls: ['./search-process.component.scss'],
})
export class SearchProcessNewComponent {
  @Output() emitSearchValues: EventEmitter<{ name: string; value: string }> =
    new EventEmitter();
  @Input() title = 'Buscar Processos';
  @Input() isAppendProcessFilter = false;
  @Input() isExpandable = true;
  @Input() hasSeachBtn = true;

  status!:{name:string, label:string}
  $subs: Subscription[] = [];

  constructor(
    private processService: ProcessService,
    private coreService: CoreService,
    public dialog: MatDialog,
    private notification: NotificationService,
    private searchProcess: SearchProcessService,
  ) {}

  get core(): LocalCore {
    return this.coreService.localCore;
  }

  get process(): Observable<any> {
    return this.processService.$obsevableProcess;
  }

  get form() {
    return this.searchProcess.filtersForm
  }

  search() {
    const coreId = this.core.id;
    console.log(this.form.value)
    const subs = this.process
      .pipe(
        switchMap((process: Process) => {
          const processes$ = this.processService.getProcessByParams(
            coreId,
            process.id,
            this.form.value,
          );
          return forkJoin({
            currentProcessId: of(process.id),
            processes: processes$,
          });
        }),
      )
      .subscribe({
        next: (obj: { currentProcessId: number; processes: Process[] }) => {
          const { currentProcessId, processes } = obj;
          if (!this.searchProcess.validSearch()) return;
          if (!processes.length) {
            this.notification.waning('Não foi encontrado nenhum processo');
            return;
          }
          this.openDialog({ processes, currentProcessId });
        },
      });
    this.$subs.push(subs);
  }

  onChangedCommonForm(event:any) {
    this.emitSearchValues.emit(event)
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
