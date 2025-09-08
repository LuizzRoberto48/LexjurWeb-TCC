import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import { GetAttachedProcess } from 'app/modules/attached-process/attached-process.model';
import { AttachedProcessService } from 'app/modules/attached-process/attached-process.service';
import { LocalCore } from 'app/modules/cores/model/get-core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { SearchModalListComponent } from 'app/modules/process/components/search-process-list/search-modal-list.component';
import { Process } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/services/process.service';
import { configDialogResource } from 'app/modules/process/utils';
import { Observable, Subscription, forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'process-attached',
  templateUrl: './process-attached.component.html',
})
export class ProcessAttachedComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  searchInputControl: any = new UntypedFormControl();

  columns: string[] = [
    'processNumber',
    'uf',
    'county',
    'organ',
    'adverseStakeholder',
    'client',
    'actions',
  ];

  dataSource = new MatTableDataSource([]);
  $subs: Subscription[] = [];
  processId!: number;

  constructor(
    protected _activatedRoute: ActivatedRoute,
    private attachedProcess: AttachedProcessService,
    private processService: ProcessService,
    public dialog: MatDialog,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
    private coreService: CoreService,
  ) {
    this.findByProcess();
  }

  openDialog(processes) {
    this.dialog.open(SearchModalListComponent, {
      data: processes,
      minWidth: '40vw',
      minHeight: '30wh',
    });
  }

  ngOnInit() {
    this.getUpdatedAttachedProcess();
  }

  getUpdatedAttachedProcess() {
    this.attachedProcess.$updateLinkedProcess.subscribe({
      next: (res: GetAttachedProcess) => {
        this.findByProcess();
      },
    });
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  goTo(attachedProcess: GetAttachedProcess) {
    window.open(`/processos/detail/${attachedProcess.id}`, '_blank');
  }

  findByProcess() {
    const subs = this.$process
      .pipe(
        switchMap((process: Process) => {
          this.processId = process.id;
          const param = { name: 'processId', value: process.id };
          return this.attachedProcess.findAll([param]);
        }),
      )
      .subscribe((attached: any[]) => {
        this.dataSource.data = attached;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        //this.dataSource.filterPredicate = this.customFilterPredicate;
      });

    this.$subs.push(subs);
  }

  removeDialog(element: GetAttachedProcess): void {
    const dialogRef = this.__confirmationService.open(
      configDialogResource('este vínculo '),
    );
    dialogRef.afterClosed().subscribe((result: 'confirmed' | 'cancelled') => {
      if (result == 'confirmed') {
        this.remove(element.linkedProcessId);
      }
    });
  }

  remove(id: number) {
    this.attachedProcess.delete(id).subscribe({
      next: () => {
        this.notification.success('Vínculo removido com sucesso');
        this.findByProcess();
      },
    });
  }

  get core(): LocalCore {
    return this.coreService.localCore;
  }

  get process(): Observable<any> {
    return this.processService.$obsevableProcess;
  }

  openListDialog(processes) {
    const dialog = this.dialog.open(SearchModalListComponent, {
      data: processes,
      minWidth: '40vw',
      minHeight: '30wh',
    });

    dialog.afterClosed().subscribe({
      next:() => {
        this.findByProcess()
      }
    })
  }

  searchList(event: any[]) {
    const id = event.find((ev) => ev.name == 'id' && ev.value);
    const caseNumber = event.find((ev) => ev.name == 'caseNumber' && ev.value);
    const uf = event.find((ev) => ev.name == 'uf' && ev.value);
    const county = event.find((ev) => ev.name == 'county' && ev.id);
    const client = event.find((ev) => ev.name == 'client' && ev.id);
    const body = {
      ...(id && { id: id.value }),
      ...(caseNumber && { caseNumber: caseNumber.value }),
      ...(uf && { uf: uf.value }),
      ...(county && { county: county.id }),
      ...(client && { client: client.id }),
    };
    if (Object.keys(body).length === 0) {
      this.notification.waning('Adicione ao menos um filtro para sua busca');
      return;
    }
    this.processAttachedSearch(body);
  }

  processAttachedSearch(params) {
    console.log(params)
    const coreId = this.core.id;
    const subs = this.process
      .pipe(
        switchMap((process: Process) => {
          const processes$ = this.processService.getProcessByParams(
            
            params,
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

          if (!processes.length) {
            this.notification.waning('Não foi encontrado nenhum processo');
            return;
          }
          this.openListDialog({ processes, currentProcessId });
        },
      });
    this.$subs.push(subs);
  }

  ngOnDestroy() {
    this.$subs.forEach((s) => s.unsubscribe());
  }
}
