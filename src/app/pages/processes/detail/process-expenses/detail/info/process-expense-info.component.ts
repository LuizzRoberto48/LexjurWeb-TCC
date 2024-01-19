import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { IProcessProgress } from 'app/modules/process-progress/models/progress.model';
import { GetProcessExpenses } from 'app/modules/process-expenses/expenses.model';

@Component({
  selector: 'process-expense-info',
  templateUrl: './process-expense-info.component.html',
})
export class ProcessExpenseInfoComponent {
  @Input() info: GetProcessExpenses;
  constructor(private location: Location) {}

  ngOnInit() {}

  back() {
    this.location.back();
  }
}
