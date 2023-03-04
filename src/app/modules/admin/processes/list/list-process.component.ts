import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CoreService } from 'app/core/cores/service/core.service';
import { GetProcess, Process } from 'app/core/process/models/process.model';
import { ProcessService } from 'app/core/process/process.service';
import { configDialog } from 'app/core/process/utils';


@Component({
  selector: 'app-form-process',
  templateUrl: './list-process.component.html',
})
export class ListProcessComponent {

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

  constructor(private route: Router,
    private processService: ProcessService,
    private coreService: CoreService,
    private __confirmationService: FuseConfirmationService) { }

  ngOnInit() {
    this.recentTransactionsDataSource.data = [];
    this.getCore()
  }

  getCore() {
    this.coreService.$obsevableCore.subscribe(res => {
      this.getListByCore(res.id)
    })
  }

  editProcess(process: GetProcess) {
    this.route.navigate([`processos/edit/${process.id}`])
  }

  getListByCore(id: number) {
    this.processService.getProcessByCore(id).subscribe({
      next: (res: GetProcess[]) => {
        this.recentTransactionsDataSource.data = res;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  newProcess() {
    this.route.navigate(['processos/new'])
  }

  removeProcessDialog(process: Process): void {
    // Open the dialog and save the reference of it
    const dialogRef = this.__confirmationService.open(configDialog(process.caseNumber));

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
