import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Paginator } from 'app/global/paginator/public-api';
import { getEnumKeyByEnumValue } from 'app/global/utils/str-manipulations';
import { CoreService } from 'app/modules/cores/service/core.service';
import {
  GetProcess,
  GetProcessPageable,
  Process,
  ProcessStatus,
} from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/services/process.service';
import { configDialogResource } from 'app/modules/process/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-process',
  templateUrl: './list-process.component.html',
})
export class ListProcessComponent {
  screenWidth: string;
  length = 0;
  pageSize = 12;
  pageIndex = 1;
  pageSizeOptions = [12, 24, 36];

  $subs: Subscription[] = [];
  coreName: string = '';
  filterProcess: { id?: number; value: string; name: string }[] = [];
  pageEvent: PageEvent;
  recentTransactionsDataSource: MatTableDataSource<any> =
    new MatTableDataSource();
  recentTransactionsTableColumns: string[] = [
    'caseNumber',
    'oldCaseNumber',
    'subject',
    'lawyer',
    'distributionDate',
    'quoteDate',
    'instance',
    'causeValue',
    'action',
  ];

  constructor(
    public route: Router,
    private processService: ProcessService,
    private coreService: CoreService,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
  ) {}

  ngOnInit() {
    this.recentTransactionsDataSource.data = [];
    this.getCore();
  }

  searchList(event: any[]) {
    const status = event.find((ev) => ev.name == 'status' && ev.value);
    const insideLawyer = event.find((ev) => ev.name == 'insideLawyer' && ev.value);
    const startDate = event.find((ev) => ev.name == 'startDate' && ev.value);
    const endDate = event.find((ev) => ev.name == 'endDate' && ev.value);
    const body = {
      ...(insideLawyer?.id && { insideLawyer: insideLawyer.id }),
      ...(status && {
        status: getEnumKeyByEnumValue(ProcessStatus, status.value),
      }),
      ...(startDate?.value && { startDate: startDate.value }),
      ...(endDate?.value && { endDate: endDate.value }),
    };
    
    this.getCore(body)
  }

  getCore(params = {}) {
    const paginator: Paginator = { page: this.pageIndex, size: this.pageSize };
    const allParams = {...paginator, ...params}
    
    const subs = this.coreService.$obsevableCore.subscribe((res) => {
      if (res?.id) {
        this.coreName = res.name;
        this.getListByCore(res.id, allParams);
      }
    });
    this.$subs.push(subs);
  }

  editProcess(process: GetProcess) {
    this.route.navigate([`processos/edit/${process.id}`]);
  }

  getListByCore(id: number, queryParams: {}) {
    this.processService.getProcessByCore(id, queryParams).subscribe({
      next: (res: GetProcessPageable) => {
        this.length = res.totalItems;
        this.recentTransactionsDataSource.data = res.process;
      },
    });
  }

  toDetail(process) {
    this.route.navigate([`/processos/detail/${process.id}`]);
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.getCore();
  }

  removeProcessDialog(process: Process): void {
    const dialogRef = this.__confirmationService.open(configDialogResource());
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.remove(process.id);
      }
    });
  }

  remove(id: number) {
    this.processService.delete(id).subscribe({
      next: () => {
        this.notification.success('processo removido com sucesso');
        this.getCore();
      },
    });
  }

  ngOnDestroy() {
    this.$subs.forEach((s) => s.unsubscribe());
  }
}
