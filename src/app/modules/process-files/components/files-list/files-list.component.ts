import { Component, Input, OnInit } from '@angular/core';
import { ProcessService } from 'app/modules/process/process.service';
import { Observable, Subscription, map, switchMap } from 'rxjs';
import {
  CrudFileMethod,
  GetUploadFile,
  ProcessFiles,
  TargetFiles,
} from '../../models/upload-process-files';
import { UploadProcessFileService } from '../../services/upload-process.service';
import { findAndReplaceFromArray } from 'app/global/utils/str-manipulations';

export const ALL = 'TODOS';
@Component({
  selector: 'files-list',
  templateUrl: './files-list.component.html',
})
export class FilesListComponent implements OnInit {
  @Input() target: { name: TargetFiles; id: number };
  @Input() isFilterTarget: boolean = true;
  @Input() $processNumber: Observable<string>;
  @Input() isCreated:boolean = false;
  isOpened = false;
  $processId: Observable<number> = new Observable();
  allFiles: GetUploadFile[] = [];
  selectedFiles: GetUploadFile[] = [];
  selectedTargets: TargetFiles[] = [TargetFiles.TODOS];
  subs: Subscription[] = [];

  constructor(
    private processService: ProcessService,
    public uploadProcessFile: UploadProcessFileService,
  ) {
    this.$getProcess();
  }

  ngOnInit() {
    this.uploadProcessFile.currentTarget = this.target;
    this.uploadProcessFile.$currentProcessNumber = this.$processNumber; //pode ser numero do processo ou do recurso
    this.findFiles()
    this.updatedFilesOnRealTime();
  }

  $getProcess() {
    this.$processId = this.processService.$obsevableProcess.pipe(
      map((process) => {
        return process.id;
      }),
    );
  }

  sendUploadFile(file: GetUploadFile) {
    const { id, targetId, target } = file;
    const subs = this.uploadProcessFile
      .findByTargetId(id, targetId, target)
      .pipe()
      .subscribe({
        next: (res) => {
          this.uploadProcessFile.file = res;
          this.selectedTargets = [TargetFiles.TODOS];
          this.selectedFiles = this.allFiles;
        },
      });
    this.subs.push(subs);
  }

  updatedFilesOnRealTime() {
    const subs = this.uploadProcessFile.$crudFile.subscribe(
      (res: CrudFileMethod) => {
        if (res) this.crudFileImplement(res);
      },
    );
    this.subs.push(subs);
  }

  private crudFileImplement(res: CrudFileMethod) {
    switch (res.method) {
      case 'create':
        this.allFiles.push(res.file);
        break;
      case 'update':
        this.allFiles = findAndReplaceFromArray(
          this.allFiles,
          'id',
          res.file.id,
          res.file,
        );
        break;
      case 'delete':
        this.allFiles = this.allFiles.filter((file) => file.id !== res.file.id);
        break;
    }
  }

  findFiles() {
    if(this.isCreated) return;
    //faz de um jeito enviando o targetId
    if (this.target?.id) {
      this.fetchFilesByTarget(this.target?.id)
      return;
    }
    this.fetchFilesByTarget()
  }

  fetchFilesByTarget(targetId?: number): void {
    this.$processId.pipe(
      switchMap((processId) =>
        this.uploadProcessFile.findByTarget(
          this.target?.name ?? TargetFiles.TODOS,
          processId,
          targetId
        )
      )
    ).subscribe((res: GetUploadFile[]) => {
      this.allFiles = res;
      this.selectedFiles = this.allFiles;
    });
  }

  onToggleChange(event: any): void {
    const checkedValues: any[] = event.value;
    const currentValue = event.source.value;
    this.btnRules(currentValue);
    this.filterFilesByChangedTarget(checkedValues, currentValue);
  }

  btnRules(currentTarget) {
    if (currentTarget === ALL) {
      this.selectedTargets = [TargetFiles.TODOS];
    } else {
      this.selectedTargets.push(currentTarget);
      this.unmarkAllButton();
    }
  }

  filterFilesByChangedTarget(targets: string[], currentValue: string) {
    currentValue == ALL
      ? (this.selectedFiles = this.allFiles)
      : (this.selectedFiles = this.allFiles.filter((file) =>
          targets.includes(file.target),
        ));
  }

  private unmarkAllButton(): void {
    this.selectedTargets = this.selectedTargets.filter(
      (target) => target !== ALL,
    );
  }

  newFile() {
    this.isOpened = true;
    this.uploadProcessFile.file = null;
    this.selectedTargets = [TargetFiles.TODOS];
    this.selectedFiles = this.allFiles;
  }

  ngOnDestroy() {
    this.selectedFiles = [];
    this.subs.forEach((s) => s.unsubscribe());
  }
}
