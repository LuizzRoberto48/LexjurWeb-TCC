import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ProcessDetailService } from 'app/core/process/process-detail.service';
import { of, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-process-resources',
  templateUrl: './resources.component.html'
})
export class ProcessResourcesComponent {

  $onDestroyRoute: Subscription = new Subscription()
  recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  recentTransactionsTableColumns: string[] = [
    'caseNumber',
    'oldCaseNumber',
    'subject',
    'lawyer',
    'distributionDate',
    'quoteDate',
    'instance',
    'causeValue'];

  constructor(private processDetailService: ProcessDetailService,
    protected activeRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  ngOnDestroy() {
    this.$onDestroyRoute.unsubscribe()
  }
}
