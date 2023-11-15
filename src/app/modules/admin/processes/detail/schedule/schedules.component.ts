import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Process } from 'app/core/process/models/process.model';
import { ProcessService } from 'app/core/process/process.service';
import { ScheduleService } from 'app/core/process/schedule/schedule.service';
import { Subscription, switchMap } from 'rxjs';
import { ScheduleFormComponent } from './form/schedule-form.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedules.component.html'
})
export class SchedulesComponent implements OnInit {
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
    private scheduleService: ScheduleService,
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
          const param = { name: 'processId', value: process.id };
          return this.scheduleService.findAll([param]);
        }),
      )
      .subscribe((resources: any[]) => {
        this.dataSource.data = resources;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ScheduleFormComponent, {
      disableClose:false
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  ngOnDestroy() {
    this.$subs.unsubscribe();
  }
}
