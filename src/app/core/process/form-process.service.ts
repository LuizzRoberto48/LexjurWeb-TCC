import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CreateProcess, PersonType, Process, ProcessForm } from "app/core/process/models/process.model";
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
        position: new FormControl('', { validators: [Validators.required] }),
        id: new FormControl('', { validators: [Validators.required] }),
        type: new FormControl('', { validators: [Validators.required] }),
        name: new FormControl('', { validators: [Validators.required] }),
        email: new FormControl('', { validators: [Validators.email] }),
        cpfCnpj: new FormControl(''),
        phone: new FormControl(''),

      }),
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
      adverseStakeholder,
      causeValue,
      ...process } = form

    const obj: CreateProcess = {
      ...process,
      adverseStakeholderId: adverseStakeholder.id,
      adversePosition: adverseStakeholder.position,
      lawyerProcess: [insideLawyerId, adverseLawyer.id],
      distributionDate: DateTime.fromFormat(distributionDate, 'dd/MM/yyyy').toISO(),
      quoteDate: DateTime.fromFormat(quoteDate, 'dd/MM/yyyy').toISO(),
      causeValue: causeValue.toString()
    }
    process.isEletronic ? obj.eletronicSystemId : delete obj.eletronicSystemId;
    return obj;
  }

  objToForm(form: FormGroup, obj: any): FormGroup<any> {
    console.log(this.processService.getOutsideLawyerByProcess(obj))
    let process: ProcessForm = {
      ...obj,
      lawAreaId: obj.LawSubArea.lawAreaId,
      lawSubAreaId: obj.LawSubArea.id,
      originId: obj.Organ.originId,
      clientId: obj.Stakeholder.clientId,
      stakeholderId: obj.Stakeholder.id,
      objectId: obj.SubObject.objectId,
      subjectId: obj.SubObject.id,
      insideLawyerId: this.processService.getInsideLawyerByProcess(obj).id,
      uf: obj.Forum.County.ufId,
      countyId: obj.Forum.countyId,
      distributionDate: DateTime.fromISO(obj.distributionDate).toFormat('dd/MM/yyyy'),
      quoteDate: DateTime.fromISO(obj.distributionDate).toFormat('dd/MM/yyyy'),
      adverseStakeholder: {
        type: obj.AdverseStakeholder.type,
        cpfCnpj: obj.AdverseStakeholder.cpfCnpj,
        phone: obj.AdverseStakeholder.phone,
        email: obj.AdverseStakeholder.email,
        name: obj.AdverseStakeholder.name,
        position: obj.adversePosition,
      },
      adverseLawyer: {
        ufOab: this.processService.getOutsideLawyerByProcess(obj).ufOab,
        name: this.processService.getOutsideLawyerByProcess(obj).name,
        oab:this.processService.getOutsideLawyerByProcess(obj).oab
      }
    };
    form.patchValue(process)
    return form;
  }
}