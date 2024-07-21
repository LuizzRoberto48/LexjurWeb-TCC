import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { DeadlineTrackerService } from 'app/modules/deadline-trackers/deadline-tracker.service';
import { TargetFiles } from 'app/modules/process-files/models/upload-process-files';
import { UploadProcessFileService } from 'app/modules/process-files/services/upload-process.service';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'complete-deadline-tracker',
  templateUrl: './complete-deadline-tracker.component.html',
  styleUrls: ['./complete-deadline-tracker.component.scss'],
})
export class CompleteDeadlineTrackerComponent {
  $processId: Observable<number> = new Observable();
  processId: number;
  $processNumber: Observable<string>;
  target: { name: string; id: number } = { name: '', id: null };
  finishedNote: string = '';
  id: number;

  constructor(
    public uploadService: UploadProcessFileService,
    private deadlineService: DeadlineTrackerService,
    private cdr: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private notification: NotificationService,
    public route: Router,
  ) {}

  ngOnInit() {
    this.uploadService.sendFinishedFile(true);
    this.deadlineIdFromRouter();
    this.getQueryParam();
    this.evAddNewFile()
  }

  evAddNewFile() {
    this.uploadService.$crudFile.subscribe({
      next: (res) => {
        console.log(res)
      },
    });
  }

  deadlineIdFromRouter() {
    this.activeRoute.params.subscribe((param) => {
      this.id = param['id'];
      this.findProcessNumberFromTarget(param['id']);
    });
  }

  getQueryParam() {
    this.activeRoute.queryParams.subscribe((param) => {
      this.processId = param['processId'];
    });
  }

  findProcessNumberFromTarget(id: number) {
    this.deadlineService
      .findById(id)
      .pipe(
        map((res) => {
          this.$processNumber = res?.resource
            ? of(res.resource.number)
            : of(res.process.caseNumber);
          return res;
        }),
      )
      .subscribe({
        next: (res) => {
          this.target = { id: res.id, name: TargetFiles.PRAZO };
          this.cdr.detectChanges();
        },
      });
  }

  send() {
    this.deadlineService
      .completeDeadline(this.id, this.finishedNote)
      .subscribe({
        next: () => {
          this.notification.success('Agendamento finalizado com sucesso');
          this.route.navigate([`processos/detail/${this.processId}/schedule`]);
        },
      });
  }
}
