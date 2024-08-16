import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DeadlineStatus } from 'app/global/components/search-fields/search-fields.model';
import { Paginator } from 'app/global/paginator/public-api';
import { getEnumKeyByEnumValue } from 'app/global/utils/str-manipulations';
import { AuthService } from 'app/modules/auth/auth.service';
import { CoreSheedList } from 'app/modules/cores/core-sheet/core-sheet.component';
import { LocalCore } from 'app/modules/cores/model/get-core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { configDialogResource } from 'app/modules/process/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'schedules',
  templateUrl: './schedules.component.html',
})
export class SchedulesComponent implements OnInit, OnDestroy {
  localCore: LocalCore;
  length = 0;
  pageSize = 12;
  pageIndex = 1;
  pageSizeOptions = [12, 24, 36];
  subs: Subscription[] = [];
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

  constructor(
    private coreService: CoreService,
    private scheduleService: DeadlineTrackerService,
    private route: Router,
    private notification: NotificationService,
    private __confirmationService: FuseConfirmationService,
    private _bottomSheet: MatBottomSheet,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getCore();
    this.showBottomSheet()
  }

  showBottomSheet() {
    this.auth.check().subscribe((isAuth) => {
      if (isAuth && !this.coreService.localCore)
        this._bottomSheet.open(CoreSheedList, { disableClose: true });
    });
  }

  getCore() {
    const subs = this.coreService.$obsevableCore.subscribe({
      next: (core) => {
        this.localCore = core;
        this.getList(core.id);
      },
    });
    this.subs.push(subs);
  }

  getList(coreId: number, params = {}) {
    const paginator: Paginator = { page: this.pageIndex, size: this.pageSize };
    const allParams = { ...paginator, ...params };
    this.scheduleService.findAllPaginated(coreId, allParams).subscribe({
      next: (schedules) => {
        this.length = schedules.totalItems;
        this.dataSource.data = schedules.items;
      },
    });
  }

  searchList(event: [{ name: string; value: any; id?: number }]) {
    const status = event.find((ev) => ev.name == 'deadlineStatus' && ev.value);
    const deadlineType = event.find(
      (ev) => ev.name == 'deadlineTypeId' && ev.value,
    );
    const deadlineSubType = event.find(
      (ev) => ev.name == 'deadlineSubTypeId' && ev.value,
    );
    const insideLawyer = event.find(
      (ev) => ev.name == 'insideLawyer' && ev.value,
    );
    const range = event.find(
      (ev) =>
        ev.name == 'rangeDate' && ev.value?.startDate && ev.value?.endDate,
    )?.value;

    const rangeInternalDate = event.find(
      (ev) =>
        ev.name == 'rangeDateInternDeadline' &&
        ev.value?.startInternDate &&
        ev.value?.endInternDate,
    )?.value;
    const body = {
      ...(deadlineType?.value && { typeId: deadlineType.value }),
      ...(deadlineSubType?.value && { subTypeId: deadlineSubType.value }),
      ...(insideLawyer?.value && { insideLawyer: insideLawyer.value }),
      ...(status && {
        status: getEnumKeyByEnumValue(DeadlineStatus, status.value),
      }),
      ...(range?.startDate && {
        startDate: range?.startDate.toUTC().set({ hour: 0 }).toISO(),
      }),
      ...(range?.endDate && {
        endDate: range?.endDate.toUTC().set({ hour: 0 }).toISO(),
      }),
      ...(rangeInternalDate?.startInternDate && {
        startInternDate: rangeInternalDate?.startInternDate,
      }),
      ...(rangeInternalDate?.endInternDate && {
        endInternDate: rangeInternalDate?.endInternDate,
      }),
    };
    this.getList(this.localCore.id, body);
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.getList(this.localCore.id);
  }

  details(element: any) {
    this.route.navigate(
      [
        `processos/detail/${element.processId}/schedule/edit/${element.processId}`,
      ],
      {
        queryParams: { processId: element.processId },
      },
    );
  }

  edit(element) {
    this.route.navigate(
      [
        `processos/detail/${element.processId}/schedule/edit/${element.processId}`,
      ],
      {
        queryParams: { processId: element.processId, isEdit: true },
      },
    );
  }

  finished(element: any) {
    this.route.navigate(
      [
        `processos/detail/${element.processId}/schedule/finished/${element.processId}`,
      ],
      {
        queryParams: { processId: element.processId },
      },
    );
  }

  remove(element: any) {
    this.scheduleService
      .delete(element.id, [{ name: 'processId', value: element.processId }]) //queryParams
      .subscribe({
        next: () => {
          
          this.notification.success('Prazo removido com sucesso');
          this.getList(this.localCore.id);
        },
      });
  }

  removeDialog(element: any) {
    const dialogRef = this.__confirmationService.open(configDialogResource());
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.remove(element);
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
