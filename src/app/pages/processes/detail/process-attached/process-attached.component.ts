import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GetAttachedProcess } from 'app/modules/attached-process/attached-process.model';
import { AttachedProcessService } from 'app/modules/attached-process/attached-process.service';
import { LocalCore } from 'app/modules/cores/model/get-core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { Process } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/services/process.service';
import { configDialogResource } from 'app/modules/process/utils';
import { Observable, Subscription, switchMap } from 'rxjs';

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
    public route: Router,
  ) {
    this.findByProcess();
  }

  open() {
    this.route.navigate(['new'], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId },
    });
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  goTo(attachedProcess: GetAttachedProcess) {
    window.open(`/processos/detail/${attachedProcess.processId}`, '_blank');
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


  ngOnDestroy() {
    this.$subs.forEach((s) => s.unsubscribe());
  }
}
