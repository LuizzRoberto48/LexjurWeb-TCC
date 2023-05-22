import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from 'app/layout/common/quick-chat/quick-chat.types';
import { map, Observable, of, Subject, Subscription, switchMap } from 'rxjs';

import { ResourceFormComponent } from '../resources/form/resource-form.component';
import { ProcessService } from 'app/core/process/process.service';
import { Process } from 'app/core/process/models/process.model';
import { ResourceService } from 'app/core/resource/resource.service';
import { MatTableDataSource } from '@angular/material/table';
import { GetResource } from 'app/core/resource/model/resource.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-process-resources',
  templateUrl: './resources.component.html',
})
export class ProcessResourcesComponent {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

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

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(
    public _activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private processService: ProcessService,
    private resourceService: ResourceService,
  ) {}

  ngOnInit() {
    this.getResourcesByProcess();
  }

  get $process() {
    return this.processService.$obsevableProcess;
  }

  getResourcesByProcess() {
    this.$process
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
    const dialogRef = this.dialog.open(ResourceFormComponent, {
      data: { processId: this.processId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
  }
}
