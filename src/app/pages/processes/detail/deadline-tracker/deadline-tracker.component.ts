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
import { Subscription, switchMap } from 'rxjs';
import { DeadlineTrackerFormComponent } from './form/deadline-tracker-form.component';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { IDeadlineTracker } from 'app/modules/deadline-trackers/model/deadline-tracker.model';

@Component({
  selector: 'deadline-tracker',
  templateUrl: './deadline-tracker.component.html',
})
export class DeadLineTrackerComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

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
  /* This _activatedRoute must be here to detail component see title of this component */
  constructor(
    protected _activatedRoute: ActivatedRoute,
    private deadlineTrackerService: DeadlineTrackerService,
    private processService: ProcessService,
    public dialog: MatDialog,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
  ) {
    this.dataSource.data = [];
  }

  ngOnInit() {
    this.getScheduleByProcess();
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  getScheduleByProcess() {
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
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DeadlineTrackerFormComponent, {
      data: { processId: this.processId },
      disableClose: false,
    });
    this.afterCloseDialog(dialogRef);
  }

  afterCloseDialog(dialogRef) {
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getScheduleByProcess();
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

  ngOnDestroy() {
    this.$subs.unsubscribe();
  }
}
