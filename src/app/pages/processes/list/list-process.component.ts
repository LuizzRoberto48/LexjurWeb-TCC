import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getEnumKeyByEnumValue } from 'app/global/utils/str-manipulations';
import {
  ProcessStatus,
} from 'app/modules/process/models/process.model';

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
