import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Process,
  ProcessStatus,
  SendProcessStatus,
} from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/services/process.service';
import { CompleteProcessFormComponent } from '../../complete-process-form/complete-process-form.component';
import { NotificationService } from '@fuse/components/notification/notification.service';

@Component({
  selector: 'app-process-general',
  templateUrl: './general.component.html',
})
export class ProcessGeneralComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  process: Process = {} as Process;

  /* This activatedRoute must be here to detail component see title of this component */
  constructor(
    private processService: ProcessService,
    protected _activatedRoute: ActivatedRoute,
    public route: Router,
    public dialog: MatDialog,
    private cdf:ChangeDetectorRef,
    private notificationService:NotificationService
  ) {}

  ngOnInit() {
    this.getEditProcess();
  }

  getEditProcess() {
    this.processService.$obsevableProcess.subscribe((res) => {
      console.log(res);
      this.process = res;
    });
  }

  getInsideLawyer(data) {
    return this.processService.getInsideLawyerByProcess(data)?.name;
  }

  getOutsideLawyer(data) {
    return this.processService.getOutsideLawyerByProcess(data);
  }

  processStatus(status: ProcessStatus) {
    return ProcessStatus[status];
  }

  toEdit() {
    this.route.navigate([`/processos/edit/${this.process.id}`]);
  }

  openDialog(isEdit:boolean = true) {
    const dialogRef = this.dialog.open(CompleteProcessFormComponent, {
      data: { processId: this.process.id, isEdit },
      minWidth: '40vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.cdf.detectChanges()
    });
  }

  reactived() {
    this.processService.reactivate(this.process.id, SendProcessStatus.ACTIVE).subscribe({
      next:(res)=> {
        this.process = {
          ...this.process,
          status: SendProcessStatus.ACTIVE
        }
        this.notificationService.success('Processo reativado com sucesso')
        this.cdf.detectChanges()
      }
    })
  }
}
