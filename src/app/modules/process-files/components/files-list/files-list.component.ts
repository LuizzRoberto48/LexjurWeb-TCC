import { Component, Input, OnInit } from '@angular/core';
import { ProcessService } from 'app/modules/process/process.service';
import { Observable, Subscription, map, switchMap, tap } from 'rxjs';
import {
  CrudFileMethod,
  GetUploadFile,
  TargetFiles,
} from '../../models/upload-process-files';
import { UploadProcessFileService } from '../../services/upload-process.service';
import { findAndReplaceFromArray } from 'app/global/utils/str-manipulations';
import { UploadFileService } from '@components/upload-file/upload-file.service';
import { UploadType } from '@components/upload-file/upload.model';
import { FuseLoadingService } from '@fuse/services/loading';
import { Router } from '@angular/router';

export const ALL = 'TODOS';
@Component({
  selector: 'files-list',
  templateUrl: './files-list.component.html',
})
export class FilesListComponent implements OnInit {
  @Input() target: { name: TargetFiles; id: number };
  @Input() isFilterTarget: boolean = true;
  @Input() $processNumber: Observable<string>;
  @Input() isCreated: boolean = false;
  isDownloading: boolean = false;
  isOpened = false;
  $processId: Observable<number> = new Observable();
  processId: number;
  allFiles: GetUploadFile[] = [];
  selectedFiles: GetUploadFile[] = [];
  selectedTargets: TargetFiles[] = [TargetFiles.TODOS];
  subs: Subscription[] = [];

  constructor(
    private processService: ProcessService,
    public uploadProcessFile: UploadProcessFileService,
    private uploadFile: UploadFileService,
    private loading: FuseLoadingService,
    private route: Router,
  ) {
    this.$getProcess();
    this.eventDownloadFromCard();
  }

  ngOnInit() {
    this.uploadProcessFile.currentTarget = this.target;
    this.uploadProcessFile.$currentProcessNumber = this.$processNumber; //pode ser numero do processo ou do recurso
    this.findFiles();
    this.updatedFilesOnRealTime();
  }

  $getProcess() {
    this.$processId = this.processService.$obsevableProcess.pipe(
      tap((process) => {
        this.processId = process.id;
        return process;
      }),
      map((process) => {
        return process.id;
      }),
    );
  }

  eventDownloadFromCard() {
    this.uploadFile.$download.subscribe({
      next: (fileType: UploadType) => {
        const uUploadFile = this.uploadProcessFile.toGetUploadFile(
          fileType,
          this.selectedFiles,
        );
        this.getFileOriginalFile(uUploadFile);
      },
    });
  }

  getFileOriginalFile(uploadFile: GetUploadFile) {
    this.loading._setLoadingStatus(
      true,
      `processos/detail/${this.processId}/files`,
    );
    this.uploadProcessFile.getFileFromBucket(uploadFile).subscribe({
      next: (res) => {
        this.uploadFile.makeDownload(res.urlFile);
      },
      complete: () => {
        this.loading._setLoadingStatus(
          false,
          `processos/detail/${this.processId}/files`,
        );
      },
    });
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
    if (this.isCreated) return;
    if (this.target?.id) {
      this.fetchFilesByTarget(this.target?.id);
      return;
    }
    this.fetchFilesByTarget();
  }

  fetchFilesByTarget(targetId?: number): void {
    this.$processId
      .pipe(
        switchMap((processId) =>
          this.uploadProcessFile.findByTarget(
            this.target?.name ?? TargetFiles.TODOS,
            processId,
            targetId,
          ),
        ),
      )
      .subscribe((res: GetUploadFile[]) => {
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
