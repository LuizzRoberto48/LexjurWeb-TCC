import { ChangeDetectionStrategy, Inject, ViewChild } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { GlDialogComponent } from '@components/gl-dialog/gl-dialog.component';
import { NotificationService } from '@fuse/components/notification/notification.service';
import {
  County,
  Forum,
  InstanceType,
  Organ,
  Origin,
} from 'app/core/process/models/process.model';
import { ProcessService } from 'app/core/process/process.service';
import {
  CreateResource,
  GetResource,
} from 'app/core/resource/model/resource.model';
import { ResourceService } from 'app/core/resource/resource.service';
import { Ufs, UfsModel } from 'app/shared/utils/get-ufs';

@Component({
  selector: 'resource-form',
  templateUrl: './resource-form.component.html',
})
export class ResourceFormComponent implements AfterViewInit {
  dialogTitle: string = 'Cadastre um recurso para o seu processo';
  ufs: UfsModel[] = [];
  counties: County[] = [];
  origins: Origin[] = [];
  forums: Forum[] = [];
  organs: Organ[] = [];

  @ViewChild(GlDialogComponent) dialog: GlDialogComponent;

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    number: new FormControl('', { validators: [Validators.required] }),
    origin: new FormControl('', { validators: [Validators.required] }),
    uf: new FormControl('', { validators: [Validators.required] }),
    county: new FormControl('', { validators: [Validators.required] }),
    forum: new FormControl('', { validators: [Validators.required] }),
    organ: new FormControl('', { validators: [Validators.required] }),
    instance: new FormControl('', { validators: [Validators.required] }),
    resourceType: new FormControl('', { validators: [Validators.required] }),
  });
  constructor(
    private processService: ProcessService,
    private mdDialogRef: MatDialogRef<GlDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { processId: number; id: number; resource?: GetResource },
    private resourceService: ResourceService,
    private notification: NotificationService,
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.getOrigins();
      this.getUfs();
      if (this.data.resource) {
        this.populateForm();
      }
    }, 0);
  }

  populateForm() {
    this.form = this.resourceService.objToForm(this.form, this.data.resource);
    this.changeOrigin();
    this.changeUfs();
    this.changeCounty();
  }

  onSubmit() {
    const obj = this.resourceService.formToObj(
      this.form.value,
      this.data.processId,
    );
    this.data.id ? this.update(obj) : this.create(obj)
  }

  create(obj: CreateResource) {
    delete obj.id;
    this.resourceService.create(obj).subscribe({
      next: () => {
        this.mdDialogRef.close(true);
        this.notification.success('Recurso criado com sucesso');
      },
      error: (error) => {
        this.mdDialogRef.close(false);
        console.log(error);
      },
    });
  }

  update(obj: CreateResource) {
    this.resourceService.update(obj).subscribe({
      next: () => {
        this.mdDialogRef.close(true);
        this.notification.success('Recurso modificado com sucesso');
      },
      error: (error) => {
        this.mdDialogRef.close(false);
        console.log(error);
      },
    });
  }

  btnClicked(event: boolean) {
    if (event) this.onSubmit();
  }

  private getOrigins() {
    this.processService.findOrigins().subscribe({
      next: (origins: Origin[]) => {
        this.origins = origins;
      },
    });
  }

  changeUfs() {
    const ufName = this.form.get('uf').value;
    this.getCountyByUf(ufName);
  }

  changeCounty() {
    const countyId = this.form.get('county').value;
    this.getForumsByCounty(countyId);
  }

  changeOrigin() {
    const originId = this.form.get('origin').value;
    this.getOrgans(originId);
  }

  get instanceTypes() {
    return Object.values(InstanceType);
  }

  private getUfs() {
    this.ufs = Ufs;
  }

  private getCountyByUf(ufId: string) {
    this.processService.findCountiesByUf(ufId).subscribe({
      next: (res) => {
        this.counties = res;
      },
    });
  }

  private getForumsByCounty(countyId: number) {
    this.processService.findForumByCountyId(countyId).subscribe({
      next: (res) => {
        this.forums = res;
      },
    });
  }

  private getOrgans(originId: number) {
    this.processService.findOrgans(originId).subscribe({
      next: (res) => {
        this.organs = res;
      },
    });
  }
}
