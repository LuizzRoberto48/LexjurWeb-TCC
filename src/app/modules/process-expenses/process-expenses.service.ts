import { Injectable, Injector } from '@angular/core';
import { BaseHttpService } from 'app/global/base-http/base-http.service';
import { ProcessExpenses } from './expenses.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'any',
})
export class ProcessExpensesService extends BaseHttpService<any> {
  constructor(protected injector: Injector) {
    super('/process_expenses', injector, ProcessExpenses.fromJson);
  }

  findExpenseTypes() {
    return this.http.get<any[]>(`${environment.apiURL}/process_expenses_types`);
  }
}
