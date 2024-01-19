import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import {
  CreateProcessExpenses,
  GetProcessExpenses,
} from 'app/modules/process-expenses/expenses.model';
import { ProcessExpensesService } from 'app/modules/process-expenses/process-expenses.service';
import { ProcessService } from 'app/modules/process/process.service';
import { Subscription, tap } from 'rxjs';
import { MY_FORMATS } from '../../../process-progress/process-progress.module';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { DateTime } from 'luxon';

@Component({
  selector: 'process-expense-form',
  templateUrl: './process-expense-form.component.html',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class ProcessExpenseFormComponent {
  @Input() editId: number;
  @Output() onUpdate: EventEmitter<GetProcessExpenses> = new EventEmitter();
  @Output() onCreate: EventEmitter<GetProcessExpenses> = new EventEmitter();
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    processId: new FormControl(null),
    type: new FormControl('', {
      validators: [Validators.required],
    }),
    expirationDate: new FormControl('', { validators: [Validators.required] }),
    paymentDate: new FormControl(null),
    price: new FormControl('', { validators: [Validators.required] }),
    isRefundable: new FormControl(false, { validators: [Validators.required] }),
    observation: new FormControl(''),
  });

  types: any[] = [];
  isLoading: boolean = false;
  processId: number;
  $subs: Subscription = new Subscription();
  constructor(
    private notification: NotificationService,
    private location: Location,
    private processService: ProcessService,
    private _activatedRoute: ActivatedRoute,
    private expenseService: ProcessExpensesService,
    private route: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.$getProcess();
    this.findTypes();
  }

  ngOnChanges() {
    this.edit();
  }

  edit() {
    if (this.editId) {
      this.form.get('id').setValue(this.editId);
      this.getEditExpense();
    }
  }

  populateForm(data: GetProcessExpenses) {
    this.form.patchValue({
      ...data,
    });
  }

  back() {
    this.location.back();
  }

  $getProcess() {
    this.$subs = this.processService.$obsevableProcess
      .pipe(
        tap((process) => {
          this.processId = process.id;
          this.form.get('processId').setValue(process.id);
        }),
      )
      .subscribe();
  }

  navigateToEdit(element: any, isCreate:boolean = false) {
    this.route.navigate(['edit/' + element.id], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId, isCreated:isCreate },
      skipLocationChange:true
    });
  }

  getEditExpense() {
    this._activatedRoute.data.subscribe({
      next: ({ data }) => {
        this.populateForm(data);
      },
    });
  }

  onSubmit() {
    this.isLoading = true;
    const id = this.form.value['id'];
    if (this.form.invalid) return;
    id ? this.updateExpense(id) : this.createExpense();
  }

  private findTypes() {
    this.expenseService.findExpenseTypes().subscribe((res: string[]) => {
      this.types = res;
    });
  }

  private formToObj(): CreateProcessExpenses {
    const { paymentDate, expirationDate, ...obj } = this.form.value;
    let isoExpDate = expirationDate;
    let isoPaymentDate = paymentDate;
    if (isoExpDate instanceof DateTime) {
      isoExpDate = isoExpDate.toISO();
    }
    if (isoPaymentDate) {
      isoPaymentDate = isoPaymentDate.toISO();
    }
    obj.paymentDate = isoPaymentDate;
    obj.expirationDate = isoExpDate;
    return obj;
  }

  private createExpense() {
    const obj = this.formToObj();
    const {id, ...rest} = obj
    this.expenseService.create(rest).subscribe({
      next: (expense:GetProcessExpenses) => {
        this.navigateToEdit(expense, true);
        this.notification.success('Despesa criada com sucesso');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private updateExpense(id: number) {
    const obj = this.formToObj();
    this.expenseService.update(obj).subscribe({
      next: (expense: GetProcessExpenses) => {
        this.onUpdate.emit(expense);
        this.notification.success('Despesa alterada com sucesso');
        
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges()
      },
    });
  }

  ngOnDestroy() {
    this.$subs.unsubscribe();
  }
}
