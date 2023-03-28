import { Component, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { Process } from 'app/core/process/models/process.model';
import { ProcessDetailService } from 'app/core/process/process-detail.service';
import { ProcessService } from 'app/core/process/process.service';

@Component({
  selector: 'app-process-general',
  templateUrl: './general.component.html'
})
export class ProcessGeneralComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  process:Process = {} as Process

  constructor(private processService: ProcessService,
    protected activeRoute: ActivatedRoute,) { }

  ngOnInit() {
    this.getEditProcess()
  }

  getEditProcess() {
    this.processService.$obsevableProcess.subscribe(res => {
      console.log(res)
      this.process = res
    })
  }

  getInsideLawyer(data) {
    return this.processService.getInsideLawyerByProcess(data)?.name
  }

  getOutsideLawyer(data) {
    return this.processService.getOutsideLawyerByProcess(data)?.lawyer.person.name
  }
}
