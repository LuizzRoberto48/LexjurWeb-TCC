import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Paginator } from 'app/global/paginator/public-api';
import { getEnumKeyByEnumValue } from 'app/global/utils/str-manipulations';
import { CoreService } from 'app/modules/cores/service/core.service';
import {
  GetProcess,
  GetProcessPageable,
  Process,
  ProcessStatus,
} from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/services/process.service';
import { configDialogResource } from 'app/modules/process/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'list-process',
  templateUrl: './list-process.component.html',
})
export class ListProcessComponent {
  
  processParams:any
 
  constructor(public route: Router) {}

  ngOnInit() {
    
  //his.getCore();
  }

  /*TODO: Ao mudar a página o filtro de busca é perdido */
  searchList(event: any[]) {
    const status = event.find((ev) => ev.name == 'processStatus' && ev.value);
    const insideLawyer = event.find((ev) => ev.name == 'insideLawyerId' && ev.value);
    const rangeDate = event.find((ev) => ev.name == 'rangeDate' && ev.value);
    this.processParams = {
      ...(insideLawyer?.value && { insideLawyer: insideLawyer.value }),
      ...(status && {
        status: getEnumKeyByEnumValue(ProcessStatus, status.value),
      }),
      ...(rangeDate?.value?.endDate && { startDate: rangeDate.value.startDate }),
      ...(rangeDate?.value?.endDate && { endDate: rangeDate.value.endDate }),
    };
  }
}
