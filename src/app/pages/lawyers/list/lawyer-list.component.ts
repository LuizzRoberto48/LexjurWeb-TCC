import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Paginator } from 'app/global/paginator/public-api';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import {
  GetLawyerPageable,
  GetLawyerSmall,
  LawyerFields,
} from 'app/modules/lawyer/model/lawyer.model';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

@Component({
  selector: 'lawyer-list',
  templateUrl: './lawyer-list.component.html',
})
export class LawyerListComponent {
  @Output() openUser: EventEmitter<any> = new EventEmitter();
  length = 0;
  pageSize = 20;
  pageIndex = 1;
  pageSizeOptions = [20];
  lawyers: GetLawyerSmall[] = [];
  crtlSearch: FormControl = new FormControl();
  $subs: Subscription[] = [];

  constructor(
    private lawyerService: LawyerService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {}

  editUser(lawyer: any): void {
    this.openUser.emit(lawyer.id);
  }

  ngOnInit() {
    this.list();
    this.search();
  }

  list(fields = {}) {
    const paginator: Paginator = { page: this.pageIndex, size: this.pageSize };
    this.lawyerService
      .findAllInsideLawyersPaginated(paginator, fields)
      .subscribe({
        next: (res: GetLawyerPageable) => {
          this.length = res.totalItems;
          this.lawyers = res.lawyers;
        },
      });
  }

  search() {
    const subs = this.crtlSearch.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms of pause in typing
        distinctUntilChanged(), // Only if the current value is different from the last
      )
      .subscribe({
        next: (value) => {
          if (value == '') {
            this.pageIndex = 1;
            this.list();
            return;
          }
          if (value.length <= 3) return;
          const fields: LawyerFields = {
            lName: value,
            logicalOperator: 'AND',
          };
          // Return the observable from the API call
          this.list(fields);
        },
      });
    this.$subs.push(subs);
  }

  newLaywer() {
    this.openUser.emit(null);
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.list();
  }

  ngOnDestroy() {
    this.$subs.forEach((s) => s.unsubscribe());
  }
}
