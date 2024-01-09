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
import { Subscription,tap } from 'rxjs';
import { Location } from '@angular/common';
import { ProcessService } from 'app/modules/process/process.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeadlineProcessWithResources } from 'app/modules/resource/model/resource.model';
import { ProcessProgressService } from 'app/modules/process-progress/progress.service';

@Component({
  selector: 'progress-form',
  templateUrl: './progress-form.component.html',
})
export class ProgressFormComponent implements OnInit, OnDestroy {
  @Input() editId: number;
  @Output() onUpdate: EventEmitter<IDeadlineTracker> = new EventEmitter();
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    processId: new FormControl(null),
    processNumber: new FormControl('', { validators: [Validators.required] }),
    type: new FormControl('', {
      validators: [Validators.required],
    }),
    createAt: new FormControl('', { validators: [Validators.required] }),
    desc: new FormControl('', { validators: [Validators.required] }),
  });

  types: any[] = [];

  processWithResources: DeadlineProcessWithResources[] = [];
  processId: number;
  $subs: Subscription = new Subscription();

  constructor(
    private typeService: DeadlineTrackerTypeService,
    private dTrackerService: DeadlineTrackerService,
    private progressService: ProcessProgressService,
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
    if (this.editId) {
      this.form.get('id').setValue(this.editId);
      this.getEditProgress();
    }
  }

  back() {
    this.location.back();
  }

  ngOnInit() {
    this.$getProcess();
    this.edit();
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

  populateForm(data) {}

  private findTypes() {
    this.typeService.findAll().subscribe((res: IDeadlineTrackerTypes[]) => {
      this.types = res;
    });
  }

  private findProcessResources() {
    this.dTrackerService
      .findProcessResources()
      .subscribe((res: DeadlineProcessWithResources[]) => {
        this.processWithResources = res;
      });
  }

  onSubmit() {
    const id = this.form.value['id'];
    if (this.form.invalid) {
      this.notification.danger(
        this.form.errors?.msg ?? 'formulário incompleto',
      );
      return;
    }
    id ? this.updateProgress() : this.createProgress();
  }

  private createProgress() {
    const { id, ...obj } = this.form.value;
    const createObj = this.formToObj(obj);
    this.progressService.create(createObj).subscribe({
      next: (deadline) => {
        this.navigateToEdit(deadline);
        this.notification.success('Prazo criado com sucesso');
      },
    });
  }

  navigateToEdit(element: any) {
    this.route.navigate(['edit/' + element.id], {
      relativeTo: this._activatedRoute.parent,
      queryParams: { processId: this.processId },
    });
  }

  private updateProgress() {
    const obj = this.form.value;
    const updatedObj = this.formToObj(obj);
    this.progressService.update(updatedObj).subscribe({
      next: (deadline: IDeadlineTracker) => {
        this.onUpdate.emit(deadline);
        this.notification.success('Prazo alterado com sucesso');
      },
    });
  }

  private formToObj(form) {}

  private objToForm(obj) {}

  ngOnDestroy() {
    this.$subs.unsubscribe();
  }
}
