import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { IDeadlineTracker } from 'app/modules/deadline-trackers/model/deadline-tracker.model';
import { TargetFiles } from 'app/modules/process-files/models/upload-process-files';
import { UploadProcessFileService } from 'app/modules/process-files/services/upload-process.service';
import { Observable, Subscription, map, of, tap } from 'rxjs';

@Component({
  selector: 'schedule-detail',
  templateUrl: './deadline-tracker-detail.component.html',
})
export class DeadlineTrackerDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  id: number;
  isEdit: boolean = false;
  target: { name: string; id: number } = { name: '', id: null };
  $processNumber: Observable<string>;
  deadline: IDeadlineTracker = {} as IDeadlineTracker;
  $subs: Subscription[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private deadlineService: DeadlineTrackerService,
    private cdr: ChangeDetectorRef,
    public uploadService: UploadProcessFileService,
  ) {
    this.editMode();
    this.uploadService.sendFinishedFile(false);
  }

  onObjectUpdated(deadline: IDeadlineTracker): void {
    // Move two steps forward (to the third step)
    this.horizontalStepper.next();
    this.horizontalStepper.next();
    this.onUpdate(deadline);
  }

  editMode() {
    this.activeRoute.params.subscribe((param) => {
      param['id'] ? (this.id = param['id']) : (this.id = null),
        (this.isEdit = !!this.id);
    });
  }

  findProcessNumberFromTarget() {
    if (!this.id) return;
    const subs = this.deadlineService
      .findById(this.id)
      .pipe(
        tap((res) => {
          this.target.id = res.id;
          this.deadline = res;
          this.cdr.detectChanges();
        }),
        map((res) => {
          this.$processNumber = res?.resource
            ? res.resource.number
            : res.process.caseNumber;
        }),
      )
      .subscribe();
    this.$subs.push(subs);
  }

  onUpdate(deadline: IDeadlineTracker) {
    this.target.id = deadline.id;
    this.deadline = deadline;
    this.$processNumber = of(
      deadline?.resource
        ? deadline.resource.number
        : deadline.process.caseNumber,
    );
  }

  ngOnInit() {
    this.findProcessNumberFromTarget();
    this.target.name = TargetFiles.PRAZO;
    this.target.id = +this.id;
  }

  ngAfterViewInit() {
    this.activeRoute.queryParams.subscribe((param: any) => {
      if (param['isEdit']) this.horizontalStepper.next();
      if (param['isCreated']) {
        this.horizontalStepper.next();
        this.horizontalStepper.next();
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.$subs.forEach((s) => s.unsubscribe());
  }
}
