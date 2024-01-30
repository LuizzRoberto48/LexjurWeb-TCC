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
import { GetProcessGuarantee } from 'app/modules/process-guarantees/model/guarantees.model';
import { ProcessGuaranteeService } from 'app/modules/process-guarantees/process-guarantee.service';
import { Process } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/process.service';
import { configDialogResource } from 'app/modules/process/utils';
import { DateTime } from 'luxon';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'process-guarantees',
  templateUrl: './process-guarantees.component.html',
})
export class ProcessGuaranteesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  searchInputControl: any = new UntypedFormControl();
  subs: Subscription[] = [];
  columns: string[] = [
    'processNumber',
    'guarantee',
    'price',
    'date',
    'actions',
  ];

  dataSource = new MatTableDataSource([]);
  processId!: number;

  constructor(
    private guaranteeService: ProcessGuaranteeService,
    private processService: ProcessService,
    protected _activatedRoute: ActivatedRoute,
    public route: Router,
    public dialog: MatDialog,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
  ) {
    this.getGuaranteeByProcess();
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

  customFilterPredicate(data: GetProcessGuarantee, value: string) {
    const filter = value.toLocaleLowerCase();
    return (
      data.guarantee.toLowerCase().includes(filter) ||
      DateTime.fromISO(data.date)
        .toUTC()
        .toFormat('dd/MM/yyyy')
        .includes(filter) ||
      data.price.toString().toLowerCase().includes(filter)
    );
  }

  getGuaranteeByProcess() {
    const $subs = this.$process
      .pipe(
        switchMap((process: Process) => {
          this.processId = process.id;
          const param = { name: 'processId', value: process.id };
          return this.guaranteeService.findAll([param]);
        }),
      )
      .subscribe((guarantees: GetProcessExpenses[]) => {
        console.log(guarantees);
        this.dataSource.data = guarantees;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicate;
      });
    this.subs.push($subs);
  }

  edit(element: GetProcessExpenses) {
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
    this.guaranteeService
      .delete(id) //queryParams
      .subscribe({
        next: () => {
          this.notification.success('Garantia removida com sucesso');
          this.getGuaranteeByProcess();
        },
      });
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
