import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CreateProcess, PersonType, Process, ProcessForm } from "app/core/process/models/process.model";

@Injectable({
  providedIn: 'any'
})
export class FormProcessService {

  constructor() { }

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

  formToObj(form:ProcessForm):CreateProcess {
    const {
      uf,
      countyId,
      lawAreaId,
      originId,
      distributionDate,
      quoteDate,
      objectId,
      insideLawyerId,
      adverseLawyer,
      adverseStakeholder,
      ...process } = form
    
    console.log(adverseLawyer)
    const obj:CreateProcess = {
      ...process,
      adverseStakeholderId: adverseStakeholder.id,
      adversePosition: adverseStakeholder.position,
      lawyerProcess: [insideLawyerId, adverseLawyer.id],
      distributionDate: new Date(),
      quoteDate: new Date()
    } 
    console.log(obj)
    
    return obj

  }
}