import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProcessService } from '../../process.service';
import { Ufs } from 'app/global/utils/get-ufs';
import { CoreService } from 'app/modules/cores/service/core.service';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { LocalCore } from 'app/modules/cores/model/get-core';
import { SearchModalListComponent } from './search-modal-list/search-modal-list.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { Process } from '../../models/process.model';
import { CustomValidators } from 'app/global/forms/custom-validators';

@Component({
  selector: 'search-process',
  templateUrl: './search-process.component.html',
  styleUrls:['./search-modal-list.component.scss']
})
export class SearchProcessComponent {
  form: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      caseNumber: new FormControl(''),
      uf: new FormControl(''),
      county: new FormControl(''),
      client: new FormControl(''),
    },
    { validators: CustomValidators.atLeastNotEmptyValidator(1) },
  );
  clients = [];
  counties = [];
  ufs = [];

  constructor(
    private processService: ProcessService,
    private coreService: CoreService,
    public dialog: MatDialog,
    private notification: NotificationService,
  ) {
    this.findClients();
    this.getUfs();
  }

  get core(): LocalCore {
    return this.coreService.localCore;
  }

  get process(): Observable<any> {
    return this.processService.$obsevableProcess;
  }

  search() {
    const coreId = this.core.id;
    this.process
      .pipe(
        switchMap((process: Process) => {
          const processes$ = this.processService.getProcessByParams(
            coreId,
            process.id,
            this.form.value,
          );
          return forkJoin({
            currentProcessId: of(process.id),
            processes: processes$,
          });
        }),
      )
      .subscribe({
        next: (obj: { currentProcessId: number; processes: Process[] }) => {
          const { currentProcessId, processes } = obj;
          if (!this.validSearch()) return;
          if (!processes.length) {
            this.notification.waning('Não foi encontrado nenhum processo');
            return;
          }
          this.openDialog({ processes, currentProcessId });
        },
      });
  }

  validSearch() {
    if (!this.form.valid) {
      this.notification.waning('É preciso adicionar ao menos 1 filtro');
      return false;
    }
    return true;
  }

  changedId() {
    const id = this.form.controls['id'].value;
    const controlsToToggle = ['caseNumber', 'uf', 'county', 'client'];
    controlsToToggle.forEach((controlName) => {
      id
        ? this.form.controls[controlName].disable()
        : this.form.controls[controlName].enable();
    });
  }

  findClients() {
    this.processService.findClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
    });
  }

  private getCountyByUf(ufId: string) {
    if (!ufId) return;
    this.processService.findCountiesByUf(ufId).subscribe({
      next: (res) => {
        this.counties = res;
      },
    });
  }

  changeUfs() {
    const ufName = this.form.get('uf').value;
    this.getCountyByUf(ufName);
  }

  private getUfs() {
    this.ufs = Ufs;
  }

  openDialog(processes) {
    const dialogRef = this.dialog.open(SearchModalListComponent, {
      data: processes,
      minWidth: '40vw',
      minHeight: '30wh',
    });
  }
}
