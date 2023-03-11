import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { CoreService } from 'app/core/cores/service/core.service';
import { LawyerService } from 'app/core/lawyer/lawyer.service';
import { GetLawyer, LawyerFields } from 'app/core/lawyer/model/lawyer.model';
import {
  ActionType,
  AdverseStakeholder,
  Client,
  County,
  CreateProcess,
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
  Ufs
} from 'app/core/process/models/process.model';
import { ProcessService } from 'app/core/process/process.service';
import { map, Observable, startWith } from 'rxjs';
import { FormProcessService } from '../../../../core/process/form-process.service';

@Component({
  selector: 'app-form-process',
  templateUrl: './form-process.component.html',
  styleUrls: ['./form-process.component.scss']
})
export class FormProcessComponent implements OnInit {

  form: FormGroup = this.formService.init();
  isEletronicTypes: IsEletronic[] = this.formService.eletronicTypes;
  personTypes = this.formService.adverseType;
  lawAreas: LawArea[] = [];
  lawSubAreas: LawSubArea[] = [];
  origins: Origin[] = [];
  organs: Organ[] = []
  ufs: Ufs[] = [];
  counties: County[] = [];
  forums: Forum[] = []
  insideLaywers: GetLawyer[] = [];
  actionTypes: ActionType[] = [];
  phases: Phase[] = [];
  adverseStakeholders: AdverseStakeholder[] = [];
  objects: Object[] = [];
  subObjects: SubObject[] = [];
  clients: Client[] = [];
  stakeholders: Stakeholder[] = [];
  positions: string[] = [];
  subjects: Subject[] = [];
  adverseLawyers: GetLawyer[] = []
  filteredOptions: Observable<AdverseStakeholder[]>;
  isEdit: boolean = false;

  constructor(public formService: FormProcessService,
    private processService: ProcessService,
    private notification: NotificationService,
    private lawyerService: LawyerService,
    private route: ActivatedRoute,
    private coreService:CoreService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')
    
    this.getCore()
    this.getLawyerAreas();
    this.getUfs();
    this.getLawyersByCore(1);
    this.getActionTypes();
    this.getPhases();
    this.getObjects();
    this.getClients();
    this.getStakeholderPositions();
    this.getSubjects();
    this.observeChangeAdverseName();

    if (id) {
      this.isEdit = true;
      this.getEditProcess()
    }
  }

  getCore() {
    this.coreService.$obsevableCore.subscribe(res => {
      this.form.get('coreId').setValue(res.id)
    })
  }

  getEditProcess() {
    this.route.data.subscribe({
      next: ({ data }) => {
        this.form = this.formService.objToForm(this.form, data);
        this.changeLawArea();
        this.changeOrigin();
        this.changeUfs();
        this.changeCounty();
        this.changeObject();
        this.changeClient();
        this.changedUfOab();
      }
    })
  }

  changeLawArea() {
    const areaId = this.form.get('lawAreaId').value;
    this.getSubLawyerAreas(areaId);
    this.getOrigins(areaId);
  }

  changeOrigin() {
    const originId = this.form.get('originId').value;
    this.getOrgans(originId)
  }

  adverseSelected() {
    const option = this.form.get('adverseStakeholder.name').value;
    const found = this.adverseStakeholders.find(adv => adv.name.toLowerCase() === option.toLowerCase());
    if (!found) {
      this.form.get('adverseStakeholder.name').setValue('')
      return;
    }
    this.form.get('adverseStakeholder.id').setValue(found.id ?? null);
    this.form.get('adverseStakeholder.email').setValue(found.email ?? '');
    this.form.get('adverseStakeholder.phone').setValue(found.phone ?? '');
    this.form.get('adverseStakeholder.cpfCnpj').setValue(found.cpfCnpj ?? '');
  }

  changeOrgan() {
    const organId = this.form.get('organId').value
    const foundOrgan = this.organs.find(organ => organ.id === organId);
    if (foundOrgan)
      this.form.get('organNumber').setValue(foundOrgan.organNumber)
  }

  changeUfs() {
    const ufId = this.form.get('uf').value;
    this.getCountyByUf(ufId);
  }

  changeCounty() {
    const countyId = this.form.get('countyId').value;
    this.getForumsByCounty(countyId)
  }

  changeObject() {
    const objectId = this.form.get('objectId').value;
    this.getSubObjects(objectId)
  }

  changeClient() {
    const clientId = this.form.get('clientId').value;
    this.getStakeholders(clientId)
  }

  changeAdverseType() {
    const type = this.form.get('adverseStakeholder.type').value
    this.form.get('adverseStakeholder.cpfCnpj').setValue('');
    this.findAdverseStakeholders(type)
  }

  changedUfOab() {
    const uf = this.form.get('adverseLawyer.ufOab').value;
    this.findAdverseLawyerByUf(uf)
  }

  changedLawyerOabAdverse() {
    const lawyerName = this.form.get('adverseLawyer.name').value;
    const found = this.adverseLawyers.find(lawyer => lawyer.name === lawyerName);
    if (found) {
      this.form.get('adverseLawyer.oab').setValue(found.oab);
      this.form.get('adverseLawyer.id').setValue(found.id);
    }
  }

  get instanceTypes() {
    return Object.values(InstanceType)
  }

  get mask() {
    const personType: PersonType = this.form.get('adverseStakeholder.type').value;
    return personType === PersonType.FISICA ? '000.000.000-00' : '00.000.000/0000-00'
  }

  onSubmit() {
    if(!this.validateError()) return
    const obj = this.formService.formToObj(this.form.value)
    if (this.isEdit) {
      this.updateProcess(obj)
      return
    }
    this.createProcess(obj)
  }

  validateError() {
    if (!this.form.valid) {
      this.notification.danger('Formulário inválido. Preencha os campos corretamente')
      return false;
    }
    return true;
  }

  private createProcess(obj: CreateProcess): void {
    this.processService.create(obj).subscribe({
      next: (resp) => {
        this.notification.success('Enviado com sucesso')
      },
      error: (erro) => {
        console.log(erro);
        this.notification.danger('Formulário incorreto')
      }
    })
  }

  private updateProcess(obj: CreateProcess): void {
    const id = this.route.params['id'];
    this.processService.update(id, obj).subscribe({
      next: (resp) => {
        this.notification.success('Editado com sucesso')
      },
      error: (erro) => {
        console.log(erro);
        this.notification.danger('Formulário incorreto')
      }
    })
  }


  private getLawyerAreas() {
    this.processService.findLawAreas().subscribe({
      next: (res: LawArea[]) => {
        this.lawAreas = res;
      }
    })
  }

  private getSubLawyerAreas(lawAreaId: number) {
    this.processService.findSubLawAreas(lawAreaId).subscribe({
      next: (res) => {
        this.lawSubAreas = res
      }
    })
  }

  private getOrigins(lawAreaId: number) {
    this.processService.findOrigins(lawAreaId).subscribe({
      next: (res) => {
        this.origins = res
      }
    })
  }

  private getOrgans(originId: number) {
    this.processService.findOrgans(originId).subscribe({
      next: (res) => {
        this.organs = res
      }
    })
  }

  private getUfs() {
    this.processService.findUfs().subscribe({
      next: (res) => {
        this.ufs = res;
      }
    })
  }

  private getCountyByUf(ufId: number) {
    this.processService.findCountiesByUf(ufId).subscribe({
      next: (res) => {
        this.counties = res
      }
    })
  }

  private getForumsByCounty(countyId: number) {
    this.processService.findForumByCountyId(countyId).subscribe({
      next: (res) => {
        this.forums = res
      }
    })
  }

  private getLawyersByCore(coreId: number) {
    const fields: LawyerFields = { coreId }
    this.lawyerService.findInsideLaywerByFilter(fields).subscribe({
      next: (res) => {
        this.insideLaywers = res
      }
    })
  }

  private getActionTypes() {
    this.processService.findActiontypes().subscribe({
      next: (res) => {
        this.actionTypes = res
      }
    })
  }

  private getPhases() {
    this.processService.findPhases().subscribe({
      next: (res) => {
        this.phases = res
      }
    })
  }

  private findAdverseStakeholders(type: string) {
    this.processService.findAdverseStakeholdersByType(type).subscribe({
      next: (res) => {
        this.adverseStakeholders = res;
        this.observeChangeAdverseName()
      }
    })
  }

  private findAdverseLawyerByUf(uf: string) {
    const fields: LawyerFields = { ufOab: uf }
    this.lawyerService.findAdverseLawyerByFilter(fields).subscribe({
      next: (res) => {
        this.adverseLawyers = res
      }
    })
  }

  private findInsideLawyer(uf: string) {
    const fields: LawyerFields = { ufOab: uf }
    this.lawyerService.findAdverseLawyerByFilter(fields).subscribe({
      next: (res) => {
        this.adverseLawyers = res
      }
    })
  }

  private getObjects() {
    this.processService.findObjects().subscribe({
      next: (res) => {
        this.objects = res
      }
    })
  }

  private getSubObjects(objectId: number) {
    this.processService.findSubObjects(objectId).subscribe({
      next: (res) => {
        this.subObjects = res
      }
    })
  }

  private getClients() {
    this.processService.findClients().subscribe({
      next: (res) => {
        this.clients = res
      }
    })
  }

  private getStakeholders(clientId: number) {
    this.processService.findStakeholders(clientId).subscribe({
      next: (res) => {
        this.stakeholders = res
      }
    })
  }

  private getStakeholderPositions() {
    this.processService.findStakeholdersPositions().subscribe({
      next: (res) => {
        this.positions = res
      }
    })
  }

  private getSubjects() {
    this.processService.findSubjects().subscribe({
      next: (res) => {
        this.subjects = res
      }
    })
  }

  observeChangeAdverseName() {
    this.filteredOptions = this.form.get('adverseStakeholder.name').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): AdverseStakeholder[] {
    const filterValue = value.toLowerCase();
    return this.adverseStakeholders.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
