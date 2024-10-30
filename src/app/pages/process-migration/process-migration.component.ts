import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Paginator } from 'app/global/paginator/public-api';
import { getEnumKeyByEnumValue } from 'app/global/utils/str-manipulations';
import { AuthService } from 'app/modules/auth/auth.service';
import {
  GetProcessPageable,
  Process,
  ProcessStatus,
} from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/services/process.service';
import { MigrationProcessFormComponent } from './migration-form/migration-form.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-process-migration',
  templateUrl: './process-migration.component.html',
  styleUrls: ['./process-migration.component.scss'],
})
export class ProcessMigrationComponent {
  length = 0;
  pageSize = 12;
  pageIndex = 1;
  pageSizeOptions = [12, 24, 36];
  displayedColumns: string[] = [
    'select',
    'caseNumber',
    'oldCaseNumber',
    'lawyer',
    'distributionDate',
    'quoteDate',
    'instance',
    'causeValue',
  ];
  dataSource = new MatTableDataSource<any>();
  queryParams: any = {};
  selection = new SelectionModel<Process>(true, []);

  constructor(
    private processService: ProcessService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) {
    this.getListByCurrentLawyer();
  }

  get currentUser() {
    return this.authService.authUser;
  }

  migrateProcess() {
    const processes = this.selection.selected.map((p) => ({
      id: p.id,
      caseNumber: p.caseNumber,
    }));
    const dialogRef = this.dialog.open(MigrationProcessFormComponent, {
      width: '90vw',
      height: '90vh',
      data: processes,
      panelClass: ['migration-process'],
    });
    dialogRef.afterClosed().subscribe(() => {
      this.selection.clear();
      this.getListByCurrentLawyer();
    });
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

  searchList(event: any[]) {
    const status = event.find((ev) => ev.name == 'processStatus' && ev.value);
    const insideLawyer = event.find(
      (ev) => ev.name == 'insideLawyerId' && ev.value,
    );
    const rangeDate = event.find((ev) => ev.name == 'rangeDate' && ev.value);
    this.queryParams = {
      ...(insideLawyer?.value && { insideLawyer: insideLawyer.value }),
      ...(status && {
        status: getEnumKeyByEnumValue(ProcessStatus, status.value),
      }),
      ...(rangeDate?.value?.endDate && {
        startDate: rangeDate.value.startDate,
      }),
      ...(rangeDate?.value?.endDate && { endDate: rangeDate.value.endDate }),
    };
    this.getListByCurrentLawyer();
  }

  getListByCurrentLawyer() {
    const paginator: Paginator = { page: this.pageIndex, size: this.pageSize };
    this.queryParams = {
      ...this.queryParams,
      insideLawyer: this.currentUser.sub,
    };
    const allParams = { ...paginator, ...this.queryParams };
    this.processService.getProcessByCore(allParams).subscribe({
      next: (res: GetProcessPageable) => {
        this.length = res.totalItems;
        this.dataSource.data = res.process;
      },
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.getListByCurrentLawyer();
  }
}
