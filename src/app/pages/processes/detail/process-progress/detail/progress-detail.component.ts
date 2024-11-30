import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { TargetFiles } from 'app/modules/process-files/models/upload-process-files';
import { IProcessProgress } from 'app/modules/process-progress/models/progress.model';
import { ProcessProgressService } from 'app/modules/process-progress/progress.service';
import { Observable, Subscription, map, of, tap } from 'rxjs';

@Component({
  selector: 'progress-detail',
  templateUrl: './progress-detail.component.html',
  styleUrls: ['./progress-detail.component.scss'],
})
export class ProcessProgressDetailComponent {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  target: { name: string; id: number } = { name: '', id: null };
  isEdit: boolean = false;
  $processNumber: Observable<string>;
  progress: any;
  $subs: Subscription[] = [];
  id: number;

  constructor(
    private activeRoute: ActivatedRoute,
    private progressService: ProcessProgressService,
    private cdr: ChangeDetectorRef,
  ) {
    this.editMode();
  }

  ngOnInit() {
    this.findProcessNumberFromTarget();
    this.target.name = TargetFiles.PROGRESS;
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

  editMode() {
    this.activeRoute.params.subscribe((param) => {
      param['id'] ? (this.id = param['id']) : (this.id = null),
        (this.isEdit = !!this.id);
    });
  }

  onUpdate(progress: IProcessProgress) {
    this.target.id = progress.id;
    this.progress = progress;
    this.$processNumber = of(
      progress?.resource
        ? progress.resource.number
        : progress.process.caseNumber,
    );
  }

  findProcessNumberFromTarget() {
    if (!this.id) return;
    const subs = this.progressService
      .findById(this.id)
      .pipe(
        tap((res) => {
          this.target.id = res.id;
          this.progress = res;
          this.cdr.detectChanges();
        }),
        map((res) => {
          this.$processNumber = res?.resource
            ? of(res.resource.number)
            : of(res.process.caseNumber);
        }),
      )
      .subscribe();
    this.$subs.push(subs);
  }

  ngOnDestroy() {
    this.$subs.forEach(s=>s.unsubscribe())
  }
}
