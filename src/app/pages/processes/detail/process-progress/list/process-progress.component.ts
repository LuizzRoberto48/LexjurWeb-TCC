import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ProcessProgress } from 'app/modules/process-progress/models/progress.model';
import { ProcessProgressService } from 'app/modules/process-progress/progress.service';
import { configDialogResource } from 'app/modules/process/utils';

@Component({
  selector: 'app-process-progress',
  templateUrl: './process-progress.component.html',
})
export class ProcessProgressComponent {
  processId!: number;
  dataSource = new MatTableDataSource([]);
  columns: string[] = ['processNumber', 'createAt', 'type', 'actions'];
  constructor(
    protected _activatedRoute: ActivatedRoute,
    public route: Router,
    private progressService: ProcessProgressService,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
  ) {
    this.dataSource.data = [];
  }

  ngOnInit() {
    this.getProgressByProcess();
  }

  open() {
    this.route.navigate(['new'], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId },
    });
  }

  edit(element: ProcessProgress) {
    this.route.navigate(['edit/' + element.id], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId },
    });
  }

  getProgressByProcess() {
    this.progressService.findByProcess().subscribe((res) => {
      this.dataSource.data = res;
    });
  }

  removeDialog(id: number) {
    const dialogRef = this.__confirmationService.open(configDialogResource());
    dialogRef.afterClosed().subscribe((result: 'confirmed' | 'cancelled') => {
      if (result == 'confirmed') {
        this.remove(id);
      }
    });
  }

  remove(id: number) {
    this.progressService
      .delete(id) //queryParams
      .subscribe({
        next: () => {
          this.notification.success('Progresso removido com sucesso');
          this.getProgressByProcess();
        },
      });
  }
}
