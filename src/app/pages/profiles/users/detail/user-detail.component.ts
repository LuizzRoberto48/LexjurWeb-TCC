import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateUtilService } from 'app/global/services/date-util.service';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent{
  constructor(
    private dateUtil: DateUtilService,
  ){}

  @Input() lawyerInfo = {} as any;
  @Output() closeDrawer = new EventEmitter<any>();

  drawerActions(){
    this.closeDrawer.emit(true);
  }

  get birthday() {
    return this.lawyerInfo.birthday
      ? this.dateUtil.fromISO(this.lawyerInfo.birthday).toFormat('dd MMMM yyyy')
      : 'Sem informação';
  }
}
