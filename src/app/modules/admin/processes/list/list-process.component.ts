import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CoreService } from 'app/core/cores/service/core.service';
import { GetProcess, GetProcessPageable, Process } from 'app/core/process/models/process.model';
import { ProcessService } from 'app/core/process/process.service';
import { configDialog } from 'app/core/process/utils';
import { Paginator } from 'app/shared/paginator/paginator.model';
import { Subscription } from 'rxjs';

const MINWIDTH = 1024

@Component({
  selector: 'app-form-process',
  templateUrl: './list-process.component.html',
})
export class ListProcessComponent {
  screenWidth: string;
  length = 0;
  pageSize = 2;
  pageIndex = 1
  pageSizeOptions = [2, 6, 25];

  $subsChangedCore: Subscription = new Subscription()
  coreName: string = ''

  pageEvent: PageEvent;
  recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  recentTransactionsTableColumns: string[] = [
    'caseNumber',
    'oldCaseNumber',
    'subject',
    'lawyer',
    'distributionDate',
    'quoteDate',
    'instance',
    'causeValue',
    'action'];

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  constructor(public route: Router,
    private processService: ProcessService,
    private coreService: CoreService,
    private __confirmationService: FuseConfirmationService,
  ) {

  }

  ngOnInit() {
    this.recentTransactionsDataSource.data = [];
    this.getCore()
  }

  getCore() {
    let paginator: Paginator = { page: this.pageIndex, size: this.pageSize }
    this.$subsChangedCore = this.coreService.$obsevableCore.subscribe(res => {
      if (res?.id) {
        this.coreName = res.name
        this.getListByCore(res.id, paginator)
      }
    })
  }

  editProcess(process: GetProcess) {
    this.route.navigate([`processos/edit/${process.id}`])
  }

  getListByCore(id: number, paginator: Paginator) {
    this.processService.getProcessByCore(id, paginator).subscribe({
      next: (res: GetProcessPageable) => {
        console.log(res)
        this.length = res.totalItems
        this.recentTransactionsDataSource.data = res.process;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  toDetail(process) {
    this.route.navigate([`/processos/detail/${process.id}`])
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex + 1
    this.pageSize = e.pageSize;
    this.getCore()
  }

  removeProcessDialog(process: Process): void {
    const dialogRef = this.__confirmationService.open(configDialog(process.caseNumber));
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  ngOnDestroy() {
    this.$subsChangedCore.unsubscribe()
  }
}
