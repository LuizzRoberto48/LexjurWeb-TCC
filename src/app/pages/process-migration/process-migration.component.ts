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
  
  queryParams: any = {};

  constructor( public dialog: MatDialog) {}

 

  migrateProcess(selectedProcess) {
    this.dialog.open(MigrationProcessFormComponent, {
      width: '90vw',
      height: '90vh',
      data: {total:selectedProcess.length, processes: selectedProcess},
      panelClass: ['migration-process'],
    });
    
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
  }

  
}
