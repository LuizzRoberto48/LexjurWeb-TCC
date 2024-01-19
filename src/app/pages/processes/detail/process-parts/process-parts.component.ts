import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GetProcessParts } from 'app/modules/process-parts/dto/process-parts.dto';
import { ProcessPartsService } from 'app/modules/process-parts/process-parts.service';
import { Process } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/process.service';
import { configDialogResource } from 'app/modules/process/utils';
import { Subscription, switchMap } from 'rxjs';
import { ProcessPartsFormComponent } from './form/process-parts-form.component';

@Component({
  selector: 'process-parts',
  templateUrl: './process-parts.component.html',
})
export class ProcessPartsComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  searchInputControl: any = new UntypedFormControl();

  columns: string[] = ['name', 'personType', 'position', 'actions'];

  dataSource = new MatTableDataSource([]);
  $subs: Subscription[] = [];
  processId!: number;

  constructor(
    private partsService: ProcessPartsService,
    private processService: ProcessService,
    public dialog: MatDialog,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
  ) {
    this.findByProcess();
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  editResource(element: GetProcessParts) {
    this.partsService.findById(element.id).subscribe((res) => {
      this.openDialog();
    });
  }

  findByProcess() {
    const subs = this.$process
      .pipe(
        switchMap((process: Process) => {
          this.processId = process.id;
          const param = { name: 'processId', value: process.id };
          return this.partsService.findAll([param]);
        }),
      )
      .subscribe((parts: GetProcessParts[]) => {
        this.dataSource.data = parts;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        //this.dataSource.filterPredicate = this.customFilterPredicate;
      });

    this.$subs.push(subs);
  }

  removeDialog(element: GetProcessParts): void {
    const dialogRef = this.__confirmationService.open(
      configDialogResource('este elemento '),
    );
    dialogRef.afterClosed().subscribe((result: 'confirmed' | 'cancelled') => {
      if (result == 'confirmed') {
        this.remove(element.id);
      }
    });
  }

  remove(id: number) {
    this.partsService.delete(id).subscribe({
      next: () => {
        this.notification.success('Recurso removido com sucesso');
        this.findByProcess();
      },
    });
  }

  edit(parts: GetProcessParts) {
    const data = {
      processId: this.processId,
      id: parts.id,
      parts: parts,
    };
    const dialogRef = this.dialog.open(ProcessPartsFormComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.findByProcess();
    });
  }

  openDialog() {
    const data = { processId: this.processId };
    const dialogRef = this.dialog.open(ProcessPartsFormComponent, {
      data,
      minWidth: '40vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.findByProcess();
    });
  }

  ngOnDestroy() {
    this.$subs.forEach((s) => s.unsubscribe());
  }
}
