import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AdverseStakeholder, CreateProcess, PersonType, Process, ProcessForm } from "app/modules/process/models/process.model";
import { DateTime } from "luxon";
import { ProcessService } from "./process.service";

@Injectable({
  providedIn: 'any'
})
export class FormProcessService {

  constructor(private processService: ProcessService) { }

  init() {
    return new FormGroup({
      isCNJ: new FormControl(false),
      caseNumber: new FormControl('', { validators: [Validators.required] }),
      coreId: new FormControl(null, { validators: [Validators.required] }),
      oldCaseNumber: new FormControl('', { validators: [Validators.required] }),
      isEletronic: new FormControl(false, { validators: [Validators.required] }),
      eletronicSystemId: new FormControl(''),
      uf: new FormControl('', { validators: [Validators.required] }),
      instance: new FormControl('', { validators: [Validators.required] }),
      originId: new FormControl('', { validators: [Validators.required] }),
      phaseId: new FormControl('', { validators: [Validators.required] }),
      actionTypeId: new FormControl('', { validators: [Validators.required] }),
      organId: new FormControl('', { validators: [Validators.required] }),
      organNumber: new FormControl(''),
      countyId: new FormControl('', { validators: [Validators.required] }),
      forumId: new FormControl('', { validators: [Validators.required] }),
      objectId: new FormControl(''),
      subObjectId: new FormControl(''),
      subjectId: new FormControl('', { validators: [Validators.required] }),
      lawAreaId: new FormControl('', { validators: [Validators.required] }),
      lawSubAreaId: new FormControl('', { validators: [Validators.required] }),
      clientId: new FormControl('', { validators: [Validators.required] }),
      stakeholderId: new FormControl('', { validators: [Validators.required] }),
      stakeholderPosition: new FormControl('', { validators: [Validators.required] }),
      insideLawyerId: new FormControl('', { validators: [Validators.required] }),
      adverseLawyer: new FormGroup({
        id: new FormControl('', { validators: [Validators.required] }),
        name: new FormControl('', { validators: [Validators.required] }),
        oab: new FormControl(''),
        ufOab: new FormControl('', { validators: [Validators.required] }),
      }),
      adverseStakeholder: new FormGroup({
        id: new FormControl(null),
        type: new FormControl({value:'', disabled:true}, { validators: [Validators.required] }),
        name: new FormControl('', { validators: [Validators.required] }),
        email: new FormControl( null, { validators: [Validators.email] }),
        cpfCnpj: new FormControl(null),
        phone: new FormControl(null),

      }),
      adversePosition: new FormControl('', { validators: [Validators.required] }),
      distributionDate: new FormControl('', { validators: [Validators.required] }),
      quoteDate: new FormControl('', { validators: [Validators.required] }),
      causeValue: new FormControl('', { validators: [Validators.required] }),
      description: new FormControl('', { validators: [Validators.required] })
    })
  }

  get eletronicTypes() {
    return [{
      label: 'Sim',
      value: true
    },
    {
      label: 'Não',
      value: false
    }]
  }

  get adverseType() {
    return Object.values(PersonType)
  }

  personType(type: PersonType) {
    return type === PersonType.FISICA ? 'Física' : 'Jurídica'
  }

  createAdverseStakeholder(adverse:AdverseStakeholder):AdverseStakeholder {
    adverse.email == '' ? adverse.email = undefined : adverse.email;
    adverse.phone == '' ? adverse.phone = undefined : adverse.phone;
    adverse.cpfCnpj == '' ? adverse.cpfCnpj = undefined : adverse.cpfCnpj;
    return adverse
  }

  formToObj(form: ProcessForm): CreateProcess {
    const {
      uf,
      countyId,
      lawAreaId,
      originId,
      distributionDate,
      clientId,
      quoteDate,
      objectId,
      insideLawyerId,
      adverseLawyer,
      causeValue,
      adverseStakeholder,
      ...process } = form

    const obj: CreateProcess = {
      ...process,
      adverseStakeholder: this.createAdverseStakeholder(adverseStakeholder),
      lawyerProcess: [insideLawyerId, adverseLawyer.id],
      distributionDate: DateTime.fromFormat(distributionDate, 'dd/MM/yyyy').toISO(),
      quoteDate: DateTime.fromFormat(quoteDate, 'dd/MM/yyyy').toISO(),
      causeValue: causeValue.toString()
    }
    process.isEletronic ? obj.eletronicSystemId : delete obj.eletronicSystemId;
    return obj;
  }

  objToForm(form: FormGroup, obj: any): FormGroup<any> {
    let process: ProcessForm = {
      ...obj,
      lawAreaId: obj.LawSubArea.lawAreaId,
      lawSubAreaId: obj.LawSubArea.id,
      originId: obj.Organ.originId,
      eletronicSystemId: obj.eletronicSystemId,
      clientId: obj.Stakeholder.clientId,
      stakeholderId: obj.Stakeholder.id,
      objectId: obj.SubObject.objectId,
      subjectId: obj.SubObject.id,
      insideLawyerId: this.processService.getInsideLawyerByProcess(obj).id,
      uf: obj.Forum.County.uf,
      countyId: obj.Forum.countyId,
      distributionDate: DateTime.fromISO(obj.distributionDate).toFormat('dd/MM/yyyy'),
      quoteDate: DateTime.fromISO(obj.distributionDate).toFormat('dd/MM/yyyy'),
      adverseStakeholder: {
        id: obj.AdverseStakeholder.id,
        type: obj.AdverseStakeholder.type,
        cpfCnpj: obj.AdverseStakeholder.cpfCnpj,
        phone: obj.AdverseStakeholder.phone,
        email: obj.AdverseStakeholder.email,
        name: obj.AdverseStakeholder.name,

      },
      adverseLawyer: {
        id:this.processService.getOutsideLawyerByProcess(obj).id,
        ufOab: this.processService.getOutsideLawyerByProcess(obj).ufOab,
        name: this.processService.getOutsideLawyerByProcess(obj).name,
        oab:this.processService.getOutsideLawyerByProcess(obj).oab
      }
    };
    form.patchValue(process)
    return form;
  }
}