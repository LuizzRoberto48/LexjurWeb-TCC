import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProcessService } from '../../services/process.service';
import { CoreService } from 'app/modules/cores/service/core.service';
import { PageEvent } from '@angular/material/paginator';
import { Paginator } from 'app/global/paginator/public-api';
import { GetProcess, GetProcessPageable, Process } from '../../models/process.model';
import { Subscription } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { configDialogResource } from '../../utils';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'process-table',
  templateUrl: './process-table.component.html',
  styleUrls: ['./process-table.component.scss'],
})
export class ProcessTableComponent implements OnInit {

  @Input() customActionTemplate: any;
  @Input() filter: any = {}
  @Input() removeCurrentProcess: number;
  @Input() set hasMigration(isMigration: boolean) {
    if (isMigration) this.columns.unshift('select')
  }

  length = 0;
  pageSize = 12;
  pageIndex = 1;
  pageSizeOptions = [12, 24, 36];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  $subs: Subscription[] = [];
  columns: string[] = [
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

  selection = new SelectionModel<Process>(true, []);

  constructor(
    private processService: ProcessService,
    private coreService: CoreService,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
    public route: Router,
  ) { }

  ngOnInit() {
    this.dataSource.data = [];
  }

  ngOnChanges(changes: SimpleChange) {
    if (changes['filter']?.currentValue || changes['filter']?.firstChange)
      this.getCore(this.filter || {})

  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.getCore(this.filter || {});
  }

  getCore(params = {}) {
    const paginator: Paginator = { page: this.pageIndex, size: this.pageSize };
    const allParams = { ...paginator, ...params }

    const subs = this.coreService.$obsevableCore.subscribe((res) => {
      if (res?.id) {
        this.getListByCore(res.id, allParams);
      }
    });
    this.$subs.push(subs);
  }

  getListByCore(coreId: number, queryParams: {}) {
    queryParams = {
      ...queryParams,
      coreId
    }
    this.processService.getProcessByCore(queryParams).subscribe({
      next: (res: GetProcessPageable) => {
        this.length = res.totalItems;
        this.dataSource.data = res.process;
        if (this.removeCurrentProcess)
          this.dataSource.data = this.removeCurrentProcessFromList(this.dataSource.data);
      },
    });
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

  editProcess(process: GetProcess) {
    this.route.navigate([`processos/edit/${process.id}`]);
  }

  toDetail(process) {
    this.route.navigate([`/processos/detail/${process.id}`]);
  }

  /**
 * Remove o processo corrente da lista de processos.
 * @param processes Lista de processos
 * @returns Lista sem o processo corrente
 */
  removeCurrentProcessFromList(processes: Process[]): Process[] {
    if (!this.removeCurrentProcess) return processes;
    return processes.filter(p => p.id !== this.removeCurrentProcess);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  ngOnDestroy() {
    this.$subs.forEach((s) => s.unsubscribe());
  }
}
