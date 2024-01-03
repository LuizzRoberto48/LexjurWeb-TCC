import { Component, Input } from '@angular/core';
import { ProcessService } from 'app/modules/process/process.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'process-files',
  templateUrl: './process-files.component.html',
})
export class ProcessFilesComponent {
  isOpened = false;
  $processId: Observable<number> = new Observable();
  processId: number;
  @Input() isCreated = false;
  constructor(private processService: ProcessService) {
    this.$getProcess();
  }

  $getProcess() {
    this.$processId = this.processService.$obsevableProcess.pipe(
      map((process) => {
        return process.id;
      }),
    );
  }

  newFile() {
    this.isOpened = true;
  }
}
