import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GetProcessExpenses } from 'app/modules/process-expenses/expenses.model';
import { ProcessExpensesService } from 'app/modules/process-expenses/process-expenses.service';
import { TargetFiles } from 'app/modules/process-files/models/upload-process-files';
import { ProcessProgressService } from 'app/modules/process-progress/progress.service';
import { Observable, map, of, tap } from 'rxjs';

@Component({
  selector: 'process-expense-detail',
  templateUrl: './process-expense-detail.component.html',
})
export class ProcessFormDetailComponent {
  @ViewChild('horizontalStepper') private horizontalStepper: MatStepper;

  target: { name: string; id: number } = { name: '', id: null };
  isEdit: boolean = false;
  $processNumber: Observable<string>;
  expense: GetProcessExpenses;
  id: number;

  constructor(
    private activeRoute: ActivatedRoute,
    private expenseService: ProcessExpensesService,
    private cdr: ChangeDetectorRef,
  ) {
    this.editMode();
    this.findProcessNumberFromTarget();
  }

  ngAfterViewInit() {
    this.activeRoute.queryParams.subscribe((param: any) => {
      if (param['isEdit']) this.horizontalStepper.next();
      if (param['isCreated']) {
        this.horizontalStepper.next();
        this.horizontalStepper.next();
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
    this.target.name = TargetFiles.EXPENSES;
    this.target.id = +this.id;
  }

  editMode() {
    this.activeRoute.params.subscribe((param) => {
      param['id'] ? (this.id = param['id']) : (this.id = null),
        (this.isEdit = !!this.id);
    });
  }

  onUpdate(expense: GetProcessExpenses) {
    this.target.id = expense.id;
    this.expense = expense;
    this.$processNumber = of(expense.process.caseNumber);
  }

  private findProcessNumberFromTarget() {
    if (!this.id) return;
    this.$processNumber = this.expenseService.findById(this.id).pipe(
      tap((res) => {
        this.target.id = res.id;
        this.expense = res;
        this.cdr.detectChanges();
      }),
      map((res) => res.process.caseNumber),
    );
  }
}
