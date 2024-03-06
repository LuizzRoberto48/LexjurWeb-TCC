import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { CoreService } from 'app/modules/cores/service/core.service';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import { GetLawyer, LawyerFields } from 'app/modules/lawyer/model/lawyer.model';
import {
  ActionType,
  AdverseStakeholder,
  Client,
  County,
  CreateProcess,
  EletronicSystem,
  Forum,
  InstanceType,
  IsEletronic,
  LawArea,
  LawSubArea,
  Object,
  Organ,
  Origin,
  PersonType,
  Phase,
  Stakeholder,
  Subject,
  SubObject,
} from 'app/modules/process/models/process.model';
import { ProcessService } from 'app/modules/process/process.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { Ufs, UfsModel } from 'app/global/utils/get-ufs';
import { FormProcessService } from 'app/modules/process/form-process.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { MY_FORMATS } from 'app/shared/date-picker-formats';

@Component({
  selector: 'app-form-process',
  templateUrl: './form-process.component.html',
  styleUrls: ['./form-process.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class FormProcessComponent implements OnInit {
  form: FormGroup = this.formService.init();
  isEletronicTypes: IsEletronic[] = this.formService.eletronicTypes;
  personTypes = this.formService.adverseType;
  lawAreas: LawArea[] = [];
  lawSubAreas: LawSubArea[] = [];
  origins: Origin[] = [];
  organs: Organ[] = [];
  ufs: UfsModel[] = [];
  counties: County[] = [];
  forums: Forum[] = [];
  insideLaywers: GetLawyer[] = [];
  actionTypes: ActionType[] = [];
  phases: Phase[] = [];
  adverseStakeholders: AdverseStakeholder[] = [];
  objects: Object[] = [];
  subObjects: SubObject[] = [];
  clients: Client[] = [];
  stakeholders: Stakeholder[] = [];
  eletronicSystems: EletronicSystem[] = [];
  positions: string[] = [];
  subjects: Subject[] = [];
  adverseLawyers: GetLawyer[] = [];
  filteredOptions: Observable<AdverseStakeholder[]>;
  processId!: number;
  isEdit: boolean = false;
  adverseNameFilter: string = '';

  constructor(
    public formService: FormProcessService,
    private processService: ProcessService,
    private notification: NotificationService,
    private lawyerService: LawyerService,
    private route: ActivatedRoute,

    private coreService: CoreService,
    private _router: Router,
    public _route: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.getCore();
    this.getLawyerAreas();
    this.getUfs();

    this.getActionTypes();
    this.getPhases();
    this.getObjects();
    this.getClients();
    this.getStakeholderPositions();
    this.getSubjects();

    this.observeChangeAdverseName();
    this.getEletronicSystems();

    if (id) {
      this.isEdit = true;
      this.getEditProcess();
    }
  }

  toDetail() {
    const id = this.route.snapshot.paramMap.get('id');
    this._route.navigate([`/processos/detail/${id}`]);
  }

  getCore() {
    this.coreService.$obsevableCore.subscribe((res) => {
      this.getLawyersByCore(res.id);
      this.form.get('coreId').setValue(res.id);
    });
  }

  getEditProcess() {
    this.route.data.subscribe({
      next: ({ data }) => {
        console.log(data)
        this.processId = data.id;
        this.form = this.formService.objToForm(this.form, data);
        this.form.controls['adverseStakeholder'].get('type').enable();
        this.changeLawArea();
        this.changeOrigin();
        this.changeUfs();
        this.changeCounty();
        this.changeObject();
        this.changeClient();
        this.changedUfOab();
      },
    });
  }

  changeLawArea() {
    const areaId = this.form.get('lawAreaId').value;
    this.getSubLawyerAreas(areaId);
    this.getOrigins(areaId);
  }

  changeOrigin() {
    const originId = this.form.get('originId').value;
    this.getOrgans(originId);
  }

  adverseSelected() {
    const group = this.form.get('adverseStakeholder');

    const found = this.adverseStakeholders.find(
      (adv) => adv.name.toLowerCase() === group.get('name').value.toLowerCase(),
    );
    /* Enable fields to create adverse stakeholder with process */
    this.form.controls['adverseStakeholder'].get('email');
    if (!found) {
      this.form.get('adverseStakeholder.id').setValue(null);
      group.enable();
      return;
    }

    const valuesToPatch = {
      id: found?.id,
      email: found?.email == '' ? undefined : found.email,
      phone: found?.phone == '' ? undefined : found.phone,
      cpfCnpj: found?.cpfCnpj == '' ? undefined : found.cpfCnpj,
      type: found?.type || '',
    };
    this.form.get('adverseStakeholder.type').disable();
    group.patchValue(valuesToPatch);
  }

  changeOrgan() {
    const organId = this.form.get('organId').value;
    const foundOrgan = this.organs.find((organ) => organ.id === organId);

    if (foundOrgan)
      this.form.get('organNumber').setValue(foundOrgan.organNumber);
  }

  private getEletronicSystems() {
    this.processService.findEletronicSystems().subscribe((res) => {
      this.eletronicSystems = res;
    });
  }

  changeUfs() {
    const ufName = this.form.get('uf').value;
    this.getCountyByUf(ufName);
  }

  changeCounty() {
    const countyId = this.form.get('countyId').value;
    this.getForumsByCounty(countyId);
  }

  changeObject() {
    const objectId = this.form.get('objectId').value;
    this.getSubObjects(objectId);
  }

  changeClient() {
    const clientId = this.form.get('clientId').value;
    this.getStakeholders(clientId);
  }

  changedUfOab() {
    const uf = this.form.get('adverseLawyer.ufOab').value;
    console.log(uf)
    this.findAdverseLawyerByUf(uf);
  }

  changedLawyerOabAdverse() {
    const lawyerName = this.form.get('adverseLawyer.name').value;
    const found = this.adverseLawyers.find(
      (lawyer) => lawyer.name === lawyerName,
    );
    if (found) {
      this.form.get('adverseLawyer.oab').setValue(found.oab);
      this.form.get('adverseLawyer.id').setValue(found.id);
    }
  }

  get instanceTypes() {
    return Object.values(InstanceType);
  }

  get mask() {
    const personType: PersonType = this.form.get(
      'adverseStakeholder.type',
    ).value;
    return personType === PersonType.FISICA
      ? '000.000.000-00'
      : '00.000.000/0000-00';
  }

  onSubmit() {
    if (!this.validateError()) return;
    /* GetRawValue recovery object that was disabled in the reactive form */
    const obj = this.formService.formToObj(this.form.getRawValue());
    if (this.isEdit) {
      this.updateProcess(obj);
      return;
    }
    this.createProcess(obj);
  }

  validateError() {
    if (!this.form.valid) {
      this.notification.danger(
        'Formulário inválido. Preencha os campos corretamente',
      );
      return false;
    }
    return true;
  }

  private createProcess(obj: CreateProcess): void {
    this.processService.create(obj).subscribe({
      next: (resp) => {
        this.notification.success('Enviado com sucesso');
        this._router.navigateByUrl('/processos');
      },
    });
  }

  private updateProcess(obj: CreateProcess): void {
    this.processService.update(this.processId, obj).subscribe({
      next: (resp) => {
        this.notification.success('Editado com sucesso');
        this._router.navigateByUrl('/processos');
      },
    });
  }

  private getLawyerAreas() {
    this.processService.findLawAreas().subscribe({
      next: (res: LawArea[]) => {
        this.lawAreas = res;
      },
    });
  }

  private getSubLawyerAreas(lawAreaId: number) {
    this.processService.findSubLawAreas(lawAreaId).subscribe({
      next: (res) => {
        this.lawSubAreas = res;
      },
    });
  }

  private getOrigins(lawAreaId: number) {
    this.processService.findOriginByLawArea(lawAreaId).subscribe({
      next: (res) => {
        this.origins = res;
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

  private getLawyersByCore(coreId: number) {
    this.lawyerService.findInsideLaywerByFilter(coreId, {}).subscribe({
      next: (res) => {
        this.insideLaywers = res;
      },
    });
  }

  private getActionTypes() {
    this.processService.findActiontypes().subscribe({
      next: (res) => {
        this.actionTypes = res;
      },
    });
  }

  private getPhases() {
    this.processService.findPhases().subscribe({
      next: (res) => {
        this.phases = res;
      },
    });
  }

  private findAdverseLawyerByUf(uf: string) {
    const fields: LawyerFields = { ufOab: uf };
    this.lawyerService.findAdverseLawyerByFilter(fields).subscribe({
      next: (res) => {
        this.adverseLawyers = res;
      },
    });
  }

  private getObjects() {
    this.processService.findObjects().subscribe({
      next: (res) => {
        this.objects = res;
      },
    });
  }

  private getSubObjects(objectId: number) {
    this.processService.findSubObjects(objectId).subscribe({
      next: (res) => {
        this.subObjects = res;
      },
    });
  }

  private getClients() {
    this.processService.findClients().subscribe({
      next: (res) => {
        this.clients = res;
      },
    });
  }

  private getStakeholders(clientId: number) {
    this.processService.findStakeholders(clientId).subscribe({
      next: (res) => {
        this.stakeholders = res;
      },
    });
  }

  private getStakeholderPositions() {
    this.processService.findStakeholdersPositions().subscribe({
      next: (res) => {
        this.positions = res;
      },
    });
  }

  private getSubjects() {
    this.processService.findSubjects().subscribe({
      next: (res) => {
        this.subjects = res;
      },
    });
  }

  observeChangeAdverseName() {
    this.filteredOptions = this.form
      .get('adverseStakeholder.name')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((val) => {
          /* not make search if user click to erase value*/
          if (!this._isBackspaceKeyPressed(val)) {
            return of([]);
          }
          this.adverseNameFilter = val;
          if (val && val.length > 1) {
            return this._filter(val || '');
          } else {
            return of([]);
          }
        }),
        tap((res) => {
          this.adverseStakeholders = res;
        }),
      );
  }

  _isBackspaceKeyPressed(val: string) {
    const isBack = this.adverseNameFilter.length < val.length;
    this.adverseNameFilter = val;
    return isBack;
  }

  _filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.processService
      .findAdverseStakeholdersByName(val)
      .pipe(
        map((response) =>
          response.filter(
            (option) =>
              option.name.toLowerCase().indexOf(val.toLowerCase()) === 0,
          ),
        ),
      );
  }
}
