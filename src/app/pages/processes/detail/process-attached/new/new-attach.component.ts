import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AttachedProcessService } from 'app/modules/attached-process/attached-process.service';

@Component({
  selector: 'new-attach-process',
  templateUrl: './new-attach.component.html',
  styleUrls: ['./new-attach.component.scss']
})
export class NewAttachProcessComponent {

  processId?: number;
  processParams: any = {};

  constructor(
    private notification: NotificationService,
    protected _activatedRoute: ActivatedRoute,
    public route: Router,
    private confirmationService: FuseConfirmationService,
    private attachedProcessService: AttachedProcessService,
  ) {
    // Read current processId from query params to exclude it from results
    const processId = this._activatedRoute.snapshot.queryParamMap.get('processId');
    if (processId) {
      this.processId = Number(processId);
      this.processParams = { processId: this.processId };
    }
  }

  confirmAttach(process: any) {
    const dialogRef = this.confirmationService.open({
      title: 'Confirmação',
      message: 'Tem certeza que deseja vincular este processo?',
      actions: {
        confirm: { label: 'Sim', color: 'primary' },
        cancel: { label: 'Cancelar' }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        this.attachProcess(process);
      }
    });
  }

  attachProcess(process: any) {
    this.attachedProcessService.create({ processId: this.processId, linkedProcess: process.id }).subscribe({
      next: (res) => {
        this.notification.success('Processo vinculado com sucesso!');
        this.route.navigate([`/processos/detail/${this.processId}/attached`]);
      },
      error: (err) => {
        console.error(err);
        this.notification.danger(err.error?.message || 'Erro ao vincular processo. Tente novamente mais tarde.');
      }
    });
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
    // Include current processId so backend can avoid listing it
    this.processParams = {
      ...body,
      ...(this.processId && { processId: this.processId }),
    };
  }


}
