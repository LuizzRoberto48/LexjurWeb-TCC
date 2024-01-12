import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TargetFiles } from 'app/modules/process-files/models/upload-process-files';
import { ProcessProgress } from 'app/modules/process-progress/models/progress.model';
import { ProcessProgressService } from 'app/modules/process-progress/progress.service';
import { ProcessService } from 'app/modules/process/process.service';
import { Observable, map, of, tap } from 'rxjs';

@Component({
  selector: 'progress-detail',
  templateUrl: './progress-detail.component.html',
  styleUrls: ['./progress-detail.component.scss'],
})
export class ProcessProgressDetailComponent {
  target: { name: string; id: number } = { name: '', id: null };
  isEdit: boolean = false;
  $processNumber: Observable<string>;
  progress:any
  id: number;

  constructor(
    private activeRoute: ActivatedRoute,
    private progressService:ProcessProgressService,
    private cdr: ChangeDetectorRef,
  ) {
    this.editMode();
  }

  ngOnInit() {
    this.findProcessNumberFromTarget();
    this.target.name = TargetFiles.PROGRESS;
    this.target.id = +this.id;
  }

  editMode() {
    this.activeRoute.params.subscribe((param) => {
      param['id'] ? (this.id = param['id']) : (this.id = null),
        (this.isEdit = !!this.id);
    });
  }

  onUpdate(progress: ProcessProgress) {
    this.target.id = progress.id
    this.progress = progress;
    this.$processNumber = of(
      progress?.resource
        ? progress.resource.number
        : progress.process.caseNumber,
    );
  }

  findProcessNumberFromTarget() {
    if (!this.id) return;
    this.$processNumber = this.progressService.findById(this.id).pipe(
      tap((res) => {
        this.target.id = res.id
        this.progress = res;
        this.cdr.detectChanges();
      }),
      map((res) => {
        return res?.resource ? res.resource.number : res.process.caseNumber
      }
      ),
    );
  }
}
