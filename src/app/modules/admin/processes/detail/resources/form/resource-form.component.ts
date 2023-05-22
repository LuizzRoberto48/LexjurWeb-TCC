import { ChangeDetectionStrategy } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { County } from 'app/core/process/models/process.model';
import { ProcessService } from 'app/core/process/process.service';

@Component({
  selector: 'resource-form',
  templateUrl: './resource-form.component.html',
})
export class ResourceFormComponent implements AfterViewInit {
  dialogTitle: string = 'Cadastre um recurso para o seu processo';
  ufs: string[] = [];
  counties: County[] = [];

  form: FormGroup = new FormGroup({
    number: new FormControl('', { validators: [Validators.required] }),
    origin: new FormControl('', { validators: [Validators.required] }),
    uf: new FormControl('', { validators: [Validators.required] }),
    county: new FormControl('', { validators: [Validators.required] }),
    forum: new FormControl('', { validators: [Validators.required] }),
    organ: new FormControl('', { validators: [Validators.required] }),
    instance: new FormControl('', { validators: [Validators.required] }),
    status: new FormControl('', { validators: [Validators.required] }),
    resourceType: new FormControl('', { validators: [Validators.required] }),
  });
  constructor(
    private processService: ProcessService
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.getOrigins();
      this.getUfs()
    }, 0);
  }

  onSubmit() {}

  private getOrigins() {
    this.processService.findOrigins().subscribe({
      next: (origins) => {
        console.log(origins);
      },
    });
  }

  changeUfs() {
    const ufName = this.form.get('uf').value;
    this.getCountyByUf(ufName);
  }

  private getUfs() {
    this.ufs = ['RIO DE JANEIRO', 'SÂO PAULO'];
  }

  private getCountyByUf(ufId: string) {
    this.processService.findCountiesByUf(ufId).subscribe({
      next: (res) => {
        this.counties = res;
      },
    });
  }

  changeCounty() {
    const countyId = this.form.get('county').value;
    //this.getForumsByCounty(countyId);
  }

}
