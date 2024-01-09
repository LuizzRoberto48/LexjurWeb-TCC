import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessProgressService } from 'app/modules/process-progress/progress.service';

@Component({
  selector: 'app-process-progress',
  templateUrl: './process-progress.component.html'
})
export class ProcessProgressComponent {
  processId!: number;
  dataSource = new MatTableDataSource([]);
  columns: string[] = ['processNumber', 'createAt', 'type', 'actions'];
  constructor(
    protected _activatedRoute: ActivatedRoute,
    public route: Router,
    private progressService: ProcessProgressService,
  ) {
    this.dataSource.data = [];
  }

  ngOnInit() {
    this.getProgressByProcess()
  }

  open() {
    this.route.navigate(['new'], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId },
    });
  }

  getProgressByProcess() {
    this.progressService.findByProcess().subscribe((res) => {
      this.dataSource.data = res;
    });
  }
}
