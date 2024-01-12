import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
import { ResourceFormComponent } from '../resources/form/resource-form.component';
import { ProcessService } from 'app/modules/process/process.service';
import { Process } from 'app/modules/process/models/process.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { configDialogResource } from 'app/modules/process/utils';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { ResourceService } from 'app/modules/resource/resource.service';
import { GetResource } from 'app/modules/resource/model/resource.model';
@Component({
  selector: 'app-process-resources',
  templateUrl: './resources.component.html',
})
export class ProcessResourcesComponent {

  columns: string[] = [
    'resourceNumber',
    'origin',
    'uf',
    'county',
    'forum',
    'organ',
    'instance',
    'status',
    'resourceType',
    'actions',
  ];

  drawerMode: 'side' | 'over';
  searchInputControl: any = new UntypedFormControl();
  dataSource = new MatTableDataSource([]);
  processId!: number;

  $subs: Subscription = new Subscription();
  $searchSubs: Subscription = new Subscription();

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  
/* This activatedRoute must be here to detail component see title of this component */
  constructor(
    public _activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private processService: ProcessService,
    private resourceService: ResourceService,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
  ) {}

  ngOnInit() {
    this.getResourcesByProcess();
    this.search();
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  private search() {
    this.$searchSubs = this.searchInputControl.valueChanges
      .pipe(tap((value: string) => this.applyFilter(value)))
      .subscribe();
  }

  private applyFilter(value: string) {
    this.dataSource.filter = <any>value.trim().toLowerCase();
  }

  getResourcesByProcess() {
    this.$subs = this.$process
      .pipe(
        switchMap((process: Process) => {
          this.processId = process.id;
          return this.resourceService.getResourcesByProcess(process.id);
        }),
      )
      .subscribe((resources: GetResource[]) => {
        this.dataSource.data = resources;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  newResource() {
    this.openDialog({ processId: this.processId });
  }

  editResource(element: GetResource) {
    this.resourceService.getById(element.id).subscribe((res) => {
      this.openDialog({
        processId: this.processId,
        id: element.id,
        resource: res,
      });
    });
  }

  removeDialog(element: GetResource): void {
    const dialogRef = this.__confirmationService.open(
      configDialogResource(element.number),
    );
    dialogRef.afterClosed().subscribe((result:'confirmed' | 'cancelled') => {
      if (result == 'confirmed') {
        this.remove(element.id);
      }
    });
  }

  remove(id: number) {
    this.resourceService.remove(id).subscribe({
      next: () => {
        this.notification.success('Recurso removido com sucesso');
        this.getResourcesByProcess();
      },
    });
  }

  openDialog(data: any) {
    const dialogRef = this.dialog.open(ResourceFormComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getResourcesByProcess();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.$subs.unsubscribe();
    this.$searchSubs.unsubscribe();
  }
}
