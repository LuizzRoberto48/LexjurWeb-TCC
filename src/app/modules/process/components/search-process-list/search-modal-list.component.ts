import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@fuse/components/notification/notification.service';

import { AttachedProcessService } from 'app/modules/attached-process/attached-process.service';
import { Process } from 'app/modules/process/models/process.model';

@Component({
  selector: 'app-search-modal-list',
  templateUrl: './search-modal-list.component.html'
})
export class SearchModalListComponent implements AfterViewInit {
  processParams: any = []
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private attachProcessService: AttachedProcessService,
    private notification: NotificationService,
  ) { 
  }
  
  ngAfterViewInit() {
    console.log(this.data)
    this.processParams = this.data
    
  }

  goTo(process) {
    window.open(`/processos/detail/${process.id}`, '_blank');
  }

  vinculate(process: Process) {
    const obj = {
      processId: this.data.currentProcessId,
      linkedProcess: process.id,
    };
    this.attachProcessService.create(obj).subscribe({
      next: (res) => {
        this.attachProcessService.linkedProcess = res
        this.notification.success('Processo vinculado com sucesso')
      },
    });
  }
}
