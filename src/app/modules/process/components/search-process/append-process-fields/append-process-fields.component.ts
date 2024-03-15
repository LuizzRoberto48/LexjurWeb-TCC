import { Component } from '@angular/core';
import { Ufs } from 'app/global/utils/get-ufs';
import { CoreService } from 'app/modules/cores/service/core.service';
import { ProcessService } from 'app/modules/process/services/process.service';
import { SearchProcessService } from 'app/modules/process/services/search-process.service';

@Component({
  selector: 'append-process-fields',
  templateUrl: './append-process-fields.component.html',
})
export class AppendProcessFieldsComponent {
  clients = [];
  counties = [];
  ufs = [];

  constructor(
    private processService: ProcessService,
    private searchProcess: SearchProcessService,
  ) {
    this.findClients();
    this.getUfs();
  }

  get form() {
    return this.searchProcess.filtersForm;
  }

  changedId() {
    this.searchProcess.changedId();
  }

  findClients() {
    this.processService.findClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
    });
  }

  changeUfs() {
    const ufName = this.searchProcess.filtersForm.get('uf').value;
    this.getCountyByUf(ufName);
  }

  private getUfs() {
    this.ufs = Ufs;
  }

  private getCountyByUf(ufId: string) {
    if (!ufId) return;
    this.processService.findCountiesByUf(ufId).subscribe({
      next: (res) => {
        this.counties = res;
      },
    });
  }
}
