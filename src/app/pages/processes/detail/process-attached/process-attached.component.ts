import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SearchModalListComponent } from 'app/global/components/search-process-list/search-modal-list.component';
import { GetAttachedProcess } from 'app/modules/attached-process/attached-process.model';
import { AttachedProcessService } from 'app/modules/attached-process/attached-process.service';
import { Process } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/process.service';
import { configDialogResource } from 'app/modules/process/utils';
import { Subscription, switchMap } from 'rxjs';

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
    private attachedProcess: AttachedProcessService,
    private processService: ProcessService,
    public dialog: MatDialog,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
  ) {
    this.findByProcess();
  }

  openDialog(processes) {
    const dialogRef = this.dialog.open(SearchModalListComponent, {
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

  ngOnDestroy() {
    this.$subs.forEach((s) => s.unsubscribe());
  }
}
