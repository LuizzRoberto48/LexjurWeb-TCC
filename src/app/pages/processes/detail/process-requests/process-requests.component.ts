import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GetProcessParts } from 'app/modules/process-parts/dto/process-parts.dto';
import { Process } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/process.service';
import { configDialogResource } from 'app/modules/process/utils';
import { Subscription, switchMap, tap } from 'rxjs';
import { ProcessRequestsFormComponent } from './form/process-requests-form.component';
import { ProcessRequestsService } from 'app/modules/process-requests/process-requests.service';
import { GetProcessRequest } from 'app/modules/process-requests/model/process-requests.model';
import { DateTime } from 'luxon';

@Component({
  selector: 'process-requests',
  templateUrl: './process-requests.component.html',
})
export class ProcessRequestsComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  searchInputControl: any = new UntypedFormControl();
  columns: string[] = [
    'request',
    'date',
    'lossProbability',
    'value',
    'provisionedValue',
    'actions',
  ];

  dataSource = new MatTableDataSource([]);
  $subs: Subscription[] = [];
  processId!: number;

  constructor(
    private requestsService: ProcessRequestsService,
    private processService: ProcessService,
    public dialog: MatDialog,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
  ) {
    this.findByProcess();
    this.search();
  }

  customFilterPredicate(data: GetProcessRequest, value: string) {
    const filter = value.toLocaleLowerCase();
    return (
      data.request.toLowerCase().includes(filter) ||
      DateTime.fromISO(data.date)
        .toUTC()
        .toFormat('dd/MM/yyyy')
        .includes(filter) ||
      data.value.toString().toLowerCase().includes(filter) ||
      data.provisionedValue.toString().toLowerCase().includes(filter) ||
      data.lossProbability.toLowerCase().includes(filter)
    );
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  private search() {
    const $searchSubs = this.searchInputControl.valueChanges
      .pipe(tap((value: string) => (this.dataSource.filter = value)))
      .subscribe();
    this.$subs.push($searchSubs);
  }

  editResource(element: GetProcessParts) {
    this.requestsService.findById(element.id).subscribe((res) => {
      this.openDialog();
    });
  }

  findByProcess() {
    const subs = this.$process
      .pipe(
        switchMap((process: Process) => {
          this.processId = process.id;
          const param = { name: 'processId', value: process.id };
          return this.requestsService.findAll([param]);
        }),
      )
      .subscribe((parts: GetProcessParts[]) => {
        this.dataSource.data = parts;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicate;
      });

    this.$subs.push(subs);
  }

  removeDialog(element: GetProcessParts): void {
    const dialogRef = this.__confirmationService.open(
      configDialogResource('este elemento '),
    );
    dialogRef.afterClosed().subscribe((result: 'confirmed' | 'cancelled') => {
      if (result == 'confirmed') {
        this.remove(element.id);
      }
    });
  }

  remove(id: number) {
    this.requestsService.delete(id).subscribe({
      next: () => {
        this.notification.success('Pedido removido com sucesso');
        this.findByProcess();
      },
    });
  }

  edit(request: GetProcessRequest) {
    const data = {
      processId: this.processId,
      id: request.id,
      request: request,
    };
    const dialogRef = this.dialog.open(ProcessRequestsFormComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.findByProcess();
    });
  }

  openDialog() {
    const data = { processId: this.processId };
    const dialogRef = this.dialog.open(ProcessRequestsFormComponent, {
      data,
      minWidth: '40vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.findByProcess();
    });
  }

  ngOnDestroy() {
    this.$subs.forEach((s) => s.unsubscribe());
  }
}
