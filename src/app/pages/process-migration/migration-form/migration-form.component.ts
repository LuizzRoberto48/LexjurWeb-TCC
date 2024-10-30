import { DialogRef } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseLoadingService } from '@fuse/services/loading';
import { Core } from 'app/modules/cores/model/get-core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import { GetLawyer } from 'app/modules/lawyer/model/lawyer.model';

@Component({
  selector: 'app-migration-form',
  templateUrl: './migration-form.component.html',
  styleUrls: ['../process-migration.component.scss'],
})
export class MigrationProcessFormComponent implements AfterViewInit {
  cores: Core[] = [];
  laywers: GetLawyer[] = [];
  filterProcessFields: { id: number; caseNumber: string }[] = [];
  selectedLawyerForm: FormControl = new FormControl();
  isLoading = false

  constructor(
    private coreService: CoreService,
    private lawyerService: LawyerService,
    public dialogRef: DialogRef<any>,
    private cdr: ChangeDetectorRef,
    private notification:NotificationService,
    @Inject(MAT_DIALOG_DATA)
    public processes: [{ id: number; caseNumber: string }],
    private loadingService: FuseLoadingService
  ) {
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getAllCores();
      this.filterProcessFields = this.processes;
    }, 0);
  }

  getAllCores() {
    this.filterProcessFields = []
    this.coreService.getAll().subscribe({
      next: (cores: Core[]) => {
        this.cores = cores;
      },
    });
  }

  changeCore(coreId: number) {
    this.loadingService.show()
    this.getLaywerByCore(coreId);
  }

  selectProcessField(event: MatAutocompleteSelectedEvent) {
    const field = event.option.value;

    const existField = this.processes.find((f) => f.id == field);
    if (!existField) return;

    const haveField = this.filterProcessFields.some((f) => f.id == field);
    if (haveField) return;

    this.filterProcessFields.push(existField);
  }

  removeProcessField(field: { id: number; caseNumber: string }) {
    this.filterProcessFields = this.filterProcessFields.filter(
      (f) => f.id != field.id,
    );
    this.cdr.detectChanges();
  }

  getLaywerByCore(coreId: number) {
    this.lawyerService.findAllInsideLawyersByCore(coreId).subscribe({
      next: (lawyers: GetLawyer[]) => {
        this.laywers = lawyers;
      },
    });
  }

  migrate() {
    const lawyerId = this.selectedLawyerForm.value;
    const processIds = this.filterProcessFields.map((p) => p.id);
    this.lawyerService.updateProcesses(lawyerId, { processIds }).subscribe({
      next: (res) => {
        this.notification.success('Processo(s) migrados com sucesso');
        this.dialogRef.close();
        this.filterProcessFields = []
        
      },
    });
  }
}
