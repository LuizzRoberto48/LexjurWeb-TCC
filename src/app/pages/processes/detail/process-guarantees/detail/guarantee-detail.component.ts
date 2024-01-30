import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TargetFiles } from 'app/modules/process-files/models/upload-process-files';
import { GetProcessGuarantee } from 'app/modules/process-guarantees/model/guarantees.model';
import { ProcessGuaranteeService } from 'app/modules/process-guarantees/process-guarantee.service';
import { Observable, map, of, tap } from 'rxjs';

@Component({
  selector: 'guarantee-detail',
  templateUrl: './guarantee-detail.component.html',
})
export class GuaranteeDetailComponent {
  @ViewChild('horizontalStepper') private horizontalStepper: MatStepper;

  target: { name: string; id: number } = { name: '', id: null };
  isEdit: boolean = false;
  $processNumber: Observable<string>;
  guarantee: GetProcessGuarantee;
  id: number;

  constructor(
    private activeRoute: ActivatedRoute,
    private guaranteeService: ProcessGuaranteeService,
    private cdr: ChangeDetectorRef,
  ) {
    this.editMode();
   
    //this.findProcessNumberFromTarget();
  }

  onObjectUpdated(guarantee: GetProcessGuarantee): void {
    // Move two steps forward (to the third step)
    this.horizontalStepper.next();
    this.horizontalStepper.next();
    this.onUpdate(guarantee);
  }

  ngAfterViewInit() {
    this.activeRoute.queryParams.subscribe((param: any) => {
      if (param['isCreated']) {
        this.horizontalStepper.next();
        this.horizontalStepper.next();
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
    this.target.name = TargetFiles.GUARANTEE;
    this.target.id = +this.id;
    this.getEditGuarantee();
  }

  editMode() {
    this.activeRoute.params.subscribe((param) => {
      param['id'] ? (this.id = param['id']) : (this.id = null),
        (this.isEdit = !!this.id);
    });
  }

  onUpdate(guarantee: GetProcessGuarantee) {
    this.target.id = guarantee.id;
    this.guarantee = guarantee;
    this.$processNumber = of(guarantee.process.caseNumber);
    this.cdr.detectChanges();
  }

  getEditGuarantee() {
    this.activeRoute.data.subscribe({
      next: ({ data }) => {
        if(data)
          this.onUpdate(data);
      },
    });
  }
}
