import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Process } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/process.service';
import { Subscription, switchMap, tap } from 'rxjs';
import { DeadlineTrackerFormComponent } from './form/deadline-tracker-form.component';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { IDeadlineTracker } from 'app/modules/deadline-trackers/model/deadline-tracker.model';
import { UntypedFormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import {
  ProgressStatus,
  stepProgress,
} from 'app/global/pipes/steps-progress.pipe';

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
    'observation',
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
        console.log(deadlineTrackers);
        this.dataSource.data = deadlineTrackers;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicate;
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DeadlineTrackerFormComponent, {
      data: { processId: this.processId },
      disableClose: false,
    });
    this.afterCloseDialog(dialogRef);
  }

  customFilterPredicate(data: IDeadlineTracker, value: string) {
    const filter = value.toLocaleLowerCase();
    const statusLables = stepProgress(data.status);
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
        .includes(filter) ||
      statusLables.toLocaleLowerCase().includes(filter)
    );
  }

  afterCloseDialog(dialogRef) {
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getDeadlineTrackerByProcess();
    });
  }

  edit(element: IDeadlineTracker) {
    const dialogRef = this.dialog.open(DeadlineTrackerFormComponent, {
      data: { processId: this.processId, editObj: element },
      disableClose: false,
    });
    this.afterCloseDialog(dialogRef);
  }

  remove(id: number) {}

  ngOnDestroy(): void {
    this.$subs.unsubscribe();
    this.$searchSubs.unsubscribe();
  }
}
