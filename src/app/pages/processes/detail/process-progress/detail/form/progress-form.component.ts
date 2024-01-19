import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { DeadlineTrackerTypeService } from 'app/modules/deadline-trackers/deadline-tracker-types.service';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { IDeadlineTrackerTypes } from 'app/modules/deadline-trackers/model/deadline-tracker-type.model';
import { IDeadlineTracker } from 'app/modules/deadline-trackers/model/deadline-tracker.model';
import { Subscription, tap } from 'rxjs';
import { Location } from '@angular/common';
import { ProcessService } from 'app/modules/process/process.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeadlineProcessWithResources } from 'app/modules/resource/model/resource.model';
import { ProcessProgressService } from 'app/modules/process-progress/progress.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { ResourceService } from 'app/modules/resource/resource.service';
import { ProcessProgressTypeService } from 'app/modules/process-progress/progress_type.service';
import {
  CreateProcessProgress,
  IProcessProgress,
  ProcessProgress,
} from 'app/modules/process-progress/models/progress.model';
import { ProcessProgressType } from 'app/modules/process-progress/models/progress_types.model';
import { DateTime } from 'luxon';

export const MY_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};
@Component({
  selector: 'progress-form',
  templateUrl: './progress-form.component.html',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class ProgressFormComponent implements OnInit, OnDestroy {
  @Input() editedProgress: IProcessProgress;
  @Output() onUpdate: EventEmitter<ProcessProgress> = new EventEmitter();
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    processId: new FormControl(null),
    processNumber: new FormControl('', { validators: [Validators.required] }),
    typeId: new FormControl('', {
      validators: [Validators.required],
    }),
    date: new FormControl('', { validators: [Validators.required] }),
    desc: new FormControl('', { validators: [Validators.required] }),
  });

  types: any[] = [];
  isLoading: boolean = false;
  processWithResources: DeadlineProcessWithResources[] = [];
  processId: number;
  $subs: Subscription = new Subscription();

  constructor(
    private progressService: ProcessProgressService,
    private pTypes: ProcessProgressTypeService,
    private resourceService: ResourceService,
    private notification: NotificationService,
    private location: Location,
    private processService: ProcessService,
    private _activatedRoute: ActivatedRoute,
    private route: Router,
  ) {
    this.findTypes();
    this.findProcessResources();
  }

  getEditProgress() {
    this._activatedRoute.data.subscribe({
      next: ({ data }) => {
        this.populateForm(data);
      },
    });
  }

  edit() {
    if (this.editedProgress?.id) {
      this.form.get('id').setValue(this.editedProgress.id);
      this.populateForm(this.editedProgress);
    }
  }

  ngOnChanges() {
    this.edit();
  }

  back() {
    this.location.back();
  }

  ngOnInit() {
    this.$getProcess();
  }

  $getProcess() {
    this.$subs = this.processService.$obsevableProcess
      .pipe(
        tap((process) => {
          this.processId = process.id;
          this.form.get('processId').setValue(process.id);
        }),
      )
      .subscribe();
  }

  populateForm(data: IProcessProgress) {
    const number = data?.resource
      ? data.resource.number
      : data.process.caseNumber;
    const { id, processProgressTypeId, ...rest } = data;
    this.form.patchValue({
      ...rest,
      typeId: processProgressTypeId,
      processNumber: number,
    });
  }

  private findTypes() {
    this.pTypes.findAll().subscribe((res: ProcessProgressType[]) => {
      this.types = res;
    });
  }

  private findProcessResources() {
    this.resourceService
      .findProcessResources()
      .subscribe((res: DeadlineProcessWithResources[]) => {
        this.processWithResources = res;
      });
  }

  onSubmit() {
    this.isLoading = true;
    const id = this.form.value['id'];
    if (this.form.invalid) return;
    id ? this.updateProgress(id) : this.createProgress();
  }

  private createProgress() {
    const obj = this.formToObj();
    this.progressService.create(obj).subscribe({
      next: (progress: ProcessProgress) => {
        this.navigateToEdit(progress);
        this.notification.success('Andamento criado com sucesso');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  navigateToEdit(element: any) {
    this.route.navigate(['edit/' + element.id], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId },
    });
  }

  private updateProgress(id: number) {
    const obj = this.formToObj();
    obj.id = id;
    this.progressService.update(obj).subscribe({
      next: (progress: ProcessProgress) => {
        this.onUpdate.emit(progress);
        this.notification.success('Andamento alterado com sucesso');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private formToObj(): CreateProcessProgress {
    const { id, date, processNumber, ...obj } = this.form.value;
    let isoDate = date;
    if (date instanceof DateTime) {
      isoDate = date.toISO();
    }

    const pwrObj = this.processWithResources.find(
      (p) => p.number == processNumber,
    );
    obj.date = isoDate;
    obj.processNumber = pwrObj;
    return obj;
  }

  ngOnDestroy() {
    this.$subs.unsubscribe();
  }
}
