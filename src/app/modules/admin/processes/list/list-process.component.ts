import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GetProcess } from 'app/core/process/models/process.model';
import { ProcessService } from 'app/core/process/process.service';


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

  constructor(private route: Router, private processService: ProcessService) { }

  ngOnInit() {
    this.recentTransactionsDataSource.data = [];
    this.getList()
  }

  editProcess(process:GetProcess) {
    this.route.navigate([`processos/edit/${process.id}`])
  }


  getList() {
    this.processService.getProcessByCore(1).subscribe({
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
}
