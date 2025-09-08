import { DialogRef } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  Component,
  Inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseLoadingService } from '@fuse/services/loading';
import { Core } from 'app/modules/cores/model/get-core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import { GetLawyer } from 'app/modules/lawyer/model/lawyer.model';
import { GetProcess, Process } from 'app/modules/process/models/process.model';

@Component({
  selector: 'app-migration-form',
  templateUrl: './migration-form.component.html',
  styleUrls: ['../process-migration.component.scss'],
})
export class MigrationProcessFormComponent implements AfterViewInit {
  cores: Core[] = [];
  laywers: GetLawyer[] = [];
  selectedLawyerForm: FormControl = new FormControl();
  isLoading = false

  constructor(
    private coreService: CoreService,
    private lawyerService: LawyerService,
    public dialogRef: DialogRef<any>,
    private notification:NotificationService,
    @Inject(MAT_DIALOG_DATA)
    public item: { total:number, processes:GetProcess[] },
    private loadingService: FuseLoadingService
  ) {
    console.log(item.processes[0].insideLawyer)
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getAllCores();
    }, 0);
  }

  getAllCores() {
    this.coreService.getAll().subscribe({
      next: (cores: Core[]) => {
        this.cores = cores;
      },
    });
  }

  changeCore(coreId: number) {
    this.loadingService.show()
    this.getLaywerByCore(coreId);
  }

  getLaywerByCore(coreId: number) {
    this.lawyerService.findAllInsideLawyersByCore(coreId).subscribe({
      next: (lawyers: GetLawyer[]) => {
        this.laywers = lawyers;
      },
    });
  }

  migrate() {
    const lawyerId = this.selectedLawyerForm.value;
    const currentLawyerIds = this.item.processes.map(p=> p.insideLawyer.id);
    const processIds = this.item.processes.map(p=> p.id);
    this.lawyerService.updateProcesses(lawyerId, { processIds, currentLawyerIds }).subscribe({
      next: (res) => {
        this.notification.success('Processo(s) migrados com sucesso');
        this.dialogRef.close();
      },
    });
  }
}
