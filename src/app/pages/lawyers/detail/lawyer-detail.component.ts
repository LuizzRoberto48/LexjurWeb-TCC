import { Component, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateUtilService } from 'app/global/services/date-util.service';
import { DrawerService } from 'app/global/services/lawyer-drawer.service';
import { LawyerFormService } from 'app/modules/lawyer/lawyer-form.service';
import { CompleteLawyer } from 'app/modules/lawyer/model/lawyer.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lawyer-detail',
  templateUrl: './lawyer-detail.component.html',
})
export class LawyerDetailComponent {
  close: EventEmitter<boolean> = new EventEmitter();
  lawyerInfo: CompleteLawyer;
  subscriptions: Subscription[] = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private dateUtil: DateUtilService,
    private drawerService: DrawerService,
    private lawyerFormService: LawyerFormService,
    private _router: Router,
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.getLawyer();
    }, 0);
  }

  getLawyer() {
    const subs = this._activatedRoute.data.subscribe({
      next: ({ data }) => {
        if (data) {
          this.lawyerInfo = data;
          this.lawyerFormService.editedLawyer = data;
        }
      },
    });
    this.subscriptions.push(subs);
  }

  onClose() {
    this.drawerService.close();
  }

  editLawyer() {
    this._router.navigateByUrl(`/lawyers/edit/${this.lawyerInfo.id}`);
  }

  get birthday() {
    return this.lawyerInfo.birthday
      ? this.dateUtil.fromISO(this.lawyerInfo.birthday).toFormat('dd MMMM yyyy')
      : 'Sem informação';
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
