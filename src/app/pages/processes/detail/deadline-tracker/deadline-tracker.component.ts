import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Process } from 'app/modules/process/models/process.model';

import { Subscription, switchMap, tap } from 'rxjs';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { IDeadlineTracker } from 'app/modules/deadline-trackers/model/deadline-tracker.model';
import { UntypedFormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { configDialogResource } from 'app/modules/process/utils';
import { ProcessService } from 'app/modules/process/services/process.service';

@Component({
  selector: 'deadline-tracker',
  templateUrl: './deadline-tracker.component.html',
})
export class DeadLineTrackerComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  searchInputControl: any = new UntypedFormControl();

  columns: string[] = [
    'processNumber',
    'type',
    'subType',
    'owner',
    'status',
    'internDeadline',
    'local',
    'actions',
  ];

  dataSource = new MatTableDataSource([]);
  $subs: Subscription = new Subscription();
  processId!: number;
  $searchSubs: Subscription = new Subscription();
  /* This _activatedRoute must be here to detail component see title of this component */
  constructor(
    protected _activatedRoute: ActivatedRoute,
    private deadlineTrackerService: DeadlineTrackerService,
    private processService: ProcessService,
    public dialog: MatDialog,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
    public route: Router,
  ) {
    this.dataSource.data = [];
  }

  ngOnInit() {
    this.getDeadlineTrackerByProcess();
    this.search();
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  private search() {
    this.$searchSubs = this.searchInputControl.valueChanges
      .pipe(tap((value: string) => (this.dataSource.filter = value)))
      .subscribe();
  }

  getDeadlineTrackerByProcess() {
    this.$subs = this.$process
      .pipe(
        switchMap((process: Process) => {
          this.processId = process.id;
          const param = { name: 'processId', value: process.id };
          return this.deadlineTrackerService.findAll([param]);
        }),
      )
      .subscribe((deadlineTrackers: IDeadlineTracker[]) => {
        this.dataSource.data = deadlineTrackers;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicate;
      });
  }

  open() {
    this.route.navigate(['new'], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId },
    });
  }

  customFilterPredicate(data: IDeadlineTracker, value: string) {
    const filter = value.toLocaleLowerCase();
    //const statusLables = stepProgress(data.status);
    return (
      data.manager.name.toLowerCase().includes(filter) ||
      data.deadlineTrackerSubType.deadlineTrackerType.label
        .toLowerCase()
        .includes(filter) ||
      data.local.toLocaleLowerCase().includes(filter) ||
      data.note.toLocaleLowerCase().includes(filter) ||
      data.deadlineTrackerSubType.label.toLocaleLowerCase().includes(filter) ||
      DateTime.fromISO(data.internalDeadline)
        .toFormat('dd/MM/yyyy')
        .includes(filter)
    );
  }

  edit(element: IDeadlineTracker) {
    this.route.navigate(['edit/' + element.id], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId, isEdit: true },
    });
  }

  details(element: IDeadlineTracker) {
    this.route.navigate(['edit/' + element.id], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId },
    });
  }

  removeDialog(element: IDeadlineTracker) {
    const dialogRef = this.__confirmationService.open(configDialogResource());
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.remove(element.id);
      }
    });
  }

  remove(id: number) {
    this.deadlineTrackerService
      .delete(id, [{ name: 'processId', value: this.processId }]) //queryParams
      .subscribe({
        next: () => {
          this.notification.success('Prazo removido com sucesso');
          this.getDeadlineTrackerByProcess();
        },
      });
  }

  finished(element: IDeadlineTracker) {
    console.log(element);
    this.route.navigate(['finished/' + element.id], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId },
    });
  }

  ngOnDestroy(): void {
    this.$subs.unsubscribe();
    this.$searchSubs.unsubscribe();
  }
}
