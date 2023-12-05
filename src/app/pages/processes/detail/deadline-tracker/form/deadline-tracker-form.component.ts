import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Core, LocalCore } from 'app/modules/cores/model/get-core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { DeadlineTrackerSubTypeService } from 'app/modules/deadline-trackers/deadline-tracker-subtypes.service';
import { DeadlineTrackerTypeService } from 'app/modules/deadline-trackers/deadline-tracker-types.service';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { IDeadlineTrackerSubTypes } from 'app/modules/deadline-trackers/model/deadline-tracker-subtype.model';
import {
  DeadlineTrackerTypes,
  IDeadlineTrackerTypes,
} from 'app/modules/deadline-trackers/model/deadline-tracker-type.model';
import { DeadlineProcessWithResources } from 'app/modules/deadline-trackers/model/deadline-tracker.model';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import { BasicLawyer } from 'app/modules/lawyer/model/lawyer.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'schedule-form',
  templateUrl: './deadline-tracker-form.component.html',
})
export class DeadlineTrackerFormComponent implements OnInit {
  dialogTitle: string = 'Cadastre um prazo para o seu processo';
  types: IDeadlineTrackerTypes[] = [];
  subTypes: IDeadlineTrackerSubTypes[] = [];
  processWithResources: DeadlineProcessWithResources[] = [];
  coreId: number;
  laywers:BasicLawyer[] = []
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    processNumber: new FormControl('', { validators: [Validators.required] }),
    subtype: new FormControl('', { validators: [Validators.required] }),
    manager: new FormControl('', { validators: [Validators.required] }),
    internDeadline: new FormControl('', { validators: [Validators.required] }),
    criticalDeadline: new FormControl(''),
    type: new FormControl('', { validators: [Validators.required] }),
    hour: new FormControl(''),
    local: new FormControl(''),
    note: new FormControl(''),
  });

  constructor(
    private typeService: DeadlineTrackerTypeService,
    private dTrackerService: DeadlineTrackerService,
    private subTypeService: DeadlineTrackerSubTypeService,
    private lawyerService: LawyerService,
    private coreService: CoreService,
  ) {
    this.findTypes();
    this.findProcessResources();
    this.findLawyersByCore()
  }

  ngOnInit() {}

  private findTypes() {
    this.typeService.findAll().subscribe((res: IDeadlineTrackerTypes[]) => {
      this.types = res;
    });
  }

  changeType() {
    const typeId = this.form.get('type').value;
    this.findSubTypesByType(typeId);
  }

  private findProcessResources() {
    this.dTrackerService
      .findProcessResources()
      .subscribe((res: DeadlineProcessWithResources[]) => {
        this.processWithResources = res;
      });
  }

  private findLawyersByCore() {
    return this.coreService.$obsevableCore
      .pipe(
        switchMap((core: LocalCore) => {
          return this.lawyerService.findLawyersByCore(core.id);
        }),
      )
      .subscribe((res:BasicLawyer[]) => {
        this.laywers = res
      });
  }

  private findSubTypesByType(typeId: number) {
    this.subTypeService
      .findAll([], 'type', typeId)
      .subscribe((res: IDeadlineTrackerSubTypes[]) => {
        this.subTypes = res;
      });
  }

  btnClicked(event: any) {
    console.log(event);
  }
}
