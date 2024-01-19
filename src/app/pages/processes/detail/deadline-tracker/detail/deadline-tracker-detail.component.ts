import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { IDeadlineTracker } from 'app/modules/deadline-trackers/model/deadline-tracker.model';
import { TargetFiles } from 'app/modules/process-files/models/upload-process-files';
import { Observable, map, of, tap } from 'rxjs';

@Component({
  selector: 'schedule-detail',
  templateUrl: './deadline-tracker-detail.component.html',
})
export class DeadlineTrackerDetailComponent implements OnInit {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  id: number;
  isEdit: boolean = false;
  target: { name: string; id: number } = { name: '', id: null };
  $processNumber: Observable<string>;
  deadline: IDeadlineTracker = {} as IDeadlineTracker;

  constructor(
    private activeRoute: ActivatedRoute,
    private deadlineService: DeadlineTrackerService,
    private cdr: ChangeDetectorRef,
  ) {
    
    this.editMode();
    this.findProcessNumberFromTarget();
  }

  editMode() {
    this.activeRoute.params.subscribe((param) => {
      param['id'] ? (this.id = param['id']) : (this.id = null),
        (this.isEdit = !!this.id);
    });
  }

  findProcessNumberFromTarget() {
    if (!this.id) return;
    this.$processNumber = this.deadlineService.findById(this.id).pipe(
      tap((res) => {
        this.target.id = res.id
        this.deadline = res;
        this.cdr.detectChanges();
      }),
      map((res) => {
        return res?.resource ? res.resource.number : res.process.caseNumber
      }
      ),
    );
  }

  onUpdate(deadline: IDeadlineTracker) {
    this.target.id = deadline.id
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
}
