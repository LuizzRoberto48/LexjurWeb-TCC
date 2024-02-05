import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GetProcessExpenses } from 'app/modules/process-expenses/expenses.model';
import { ProcessExpensesService } from 'app/modules/process-expenses/process-expenses.service';
import { Process } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/process.service';
import { configDialogResource } from 'app/modules/process/utils';
import { DateTime } from 'luxon';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'process-expenses',
  templateUrl: './process-expenses.component.html',
})
export class ProcessExpensesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  searchInputControl: any = new UntypedFormControl();
  subs: Subscription[] = [];
  columns: string[] = [
    'type',
    'price',
    'expirationDate',
    'paymentDate',
    'isRefundable',
    'actions',
  ];

  dataSource = new MatTableDataSource([]);
  processId!: number;

  constructor(
    private expensesService: ProcessExpensesService,
    private processService: ProcessService,
    protected _activatedRoute: ActivatedRoute,
    public route: Router,
    public dialog: MatDialog,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
  ) {
    this.getExpensesByProcess();
    this.search();
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  private search() {
    const $searchSubs = this.searchInputControl.valueChanges
      .pipe(tap((value: string) => (this.dataSource.filter = value)))
      .subscribe();
    this.subs.push($searchSubs);
  }

  customFilterPredicate(data: GetProcessExpenses, value: string) {
    const filter = value.toLocaleLowerCase();
    return (
      data.type.toLowerCase().includes(filter) ||
      DateTime.fromISO(data.paymentDate)
        .toUTC()
        .toFormat('dd/MM/yyyy')
        .includes(filter) ||
      data.price.toString().toLowerCase().includes(filter) ||
      (filter === 'sim' && data.isRefundable) ||
      (filter === 'não' && !data.isRefundable)
    );
  }

  getExpensesByProcess() {
    const $subs = this.$process
      .pipe(
        switchMap((process: Process) => {
          this.processId = process.id;
          const param = { name: 'processId', value: process.id };
          return this.expensesService.findAll([param]);
        }),
      )
      .subscribe((expenses: GetProcessExpenses[]) => {
        this.dataSource.data = expenses;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicate;
      });
    this.subs.push($subs);
  }

  edit(element: GetProcessExpenses) {
    this.route.navigate(['edit/' + element.id], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId, isEdit: true },
    });
  }

  details(element: GetProcessExpenses) {
    this.route.navigate(['edit/' + element.id], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId },
    });
  }

  open() {
    this.route.navigate(['new'], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId },
    });
  }

  removeDialog(id: number) {
    const dialogRef = this.__confirmationService.open(configDialogResource());
    dialogRef.afterClosed().subscribe((result: 'confirmed' | 'cancelled') => {
      if (result == 'confirmed') {
        this.remove(id);
      }
    });
  }

  remove(id: number) {
    this.expensesService
      .delete(id) //queryParams
      .subscribe({
        next: () => {
          this.notification.success('Progresso removido com sucesso');
          this.getExpensesByProcess();
        },
      });
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
