import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ProcessExpensesService } from '../process-expenses.service';

@Injectable({
  providedIn: 'any',
})
export class ExpenseFormResolver implements Resolve<any> {
  constructor(private expenseService: ProcessExpensesService) {}

  resolve(
    actroute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> {
    const id = actroute.params['id'];
    return this.expenseService.findById(id);
  }
}
