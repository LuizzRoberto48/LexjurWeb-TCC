import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProcessService } from 'app/modules/process/services/process.service';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'process-files',
  templateUrl: './process-files.component.html',
})
export class ProcessFilesComponent {
  isOpened = false;
  $processNumber: Observable<string> = new Observable();
  processId: number;
  @Input() isCreated = false;
  constructor(
    private processService: ProcessService,
    protected _activatedRoute: ActivatedRoute,
  ) {
    
  }

  ngOnInit() {
    this.$getProcess();
  }

  $getProcess() {
    this.processService.$obsevableProcess.pipe(
      map((process) => {
        this.$processNumber = of(process.caseNumber);
        console.log()
        return process.id;
      }),
    ).subscribe();
  }

  newFile() {
    this.isOpened = true;
  }
}
