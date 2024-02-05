import { Component, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { Process, ProcessStatus } from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/process.service';

@Component({
  selector: 'app-process-general',
  templateUrl: './general.component.html'
})
export class ProcessGeneralComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  process:Process = {} as Process

  /* This activatedRoute must be here to detail component see title of this component */
  constructor(private processService: ProcessService,
    protected _activatedRoute: ActivatedRoute,
    public route: Router) { }

  ngOnInit() {
    this.getEditProcess()
  }

  getEditProcess() {
    this.processService.$obsevableProcess.subscribe(res => {
      this.process = res
    })
  }

  getInsideLawyer(data) {
    return this.processService.getInsideLawyerByProcess(data)?.name
  }

  getOutsideLawyer(data) {
    return this.processService.getOutsideLawyerByProcess(data)?.name
  }

  processStatus(status:ProcessStatus) {
    return ProcessStatus[status]
  }

  toEdit() {
    this.route.navigate([`/processos/edit/${this.process.id}`]);
  }
}
