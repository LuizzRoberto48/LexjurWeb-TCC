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
import { PersonType, Process } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/services/process.service';
import { configDialogResource } from 'app/modules/process/utils';
import { Subscription, switchMap, tap } from 'rxjs';
import { ProcessPartsFormComponent } from './form/process-parts-form.component';
import { ActivatedRoute } from '@angular/router';

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
    public _activatedRoute: ActivatedRoute,
    private partsService: ProcessPartsService,
    private processService: ProcessService,
    public dialog: MatDialog,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
  ) {
    this.findByProcess();
    this.search();
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  private search() {
    const subs = this.searchInputControl.valueChanges
      .pipe(tap((value: string) => (this.dataSource.filter = value)))
      .subscribe();
    this.$subs.push(subs);
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
        this.dataSource.filterPredicate = this.customFilterPredicate;
      });

    this.$subs.push(subs);
  }

  customFilterPredicate(data: GetProcessParts, value: string) {
    const pType = PersonType[data.personType];
    const filter = value.toLocaleLowerCase();
    return data.name.toLowerCase().includes(filter) ||
    data.position.toLowerCase().includes(filter) ||
    pType.toLowerCase().includes(filter);
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

  getPersonType(type: PersonType) {
    return this.partsService.getPersonType(type);
  }
}
