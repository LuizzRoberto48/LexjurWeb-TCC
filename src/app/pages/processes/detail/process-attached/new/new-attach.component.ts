import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { ProcessService } from 'app/modules/process/services/process.service';

@Component({
  selector: 'new-attach-process',
  templateUrl: './new-attach.component.html',
  styleUrls: ['./new-attach.component.scss']
})
export class NewAttachProcessComponent {

  constructor(
    private notification: NotificationService,
    protected _activatedRoute: ActivatedRoute,
    public route: Router,
  ) {

  }

  searchList(event: any[]) {
    const id = event.find((ev) => ev.name == 'id' && ev.value);
    const caseNumber = event.find((ev) => ev.name == 'caseNumber' && ev.value);
    const uf = event.find((ev) => ev.name == 'uf' && ev.value);
    const county = event.find((ev) => ev.name == 'county' && ev.id);
    const client = event.find((ev) => ev.name == 'client' && ev.id);
    const body = {
      ...(id && { id: id.value }),
      ...(caseNumber && { caseNumber: caseNumber.value }),
      ...(uf && { uf: uf.value }),
      ...(county && { county: county.id }),
      ...(client && { client: client.id }),
    };
    if (Object.keys(body).length === 0) {
      this.notification.waning('Adicione ao menos um filtro para sua busca');
      return;
    }
  }
  

}
