import { GetLawyer } from "app/core/lawyer/model/lawyer.model"


export enum InstanceType {
  PRIMEIRA = 'PRIMEIRA',
  SEGUNDA = 'SEGUNDA',
  TERCEIRA = 'TERCEIRA'
};

export enum PersonType {
  FISICA = 'FISICA',
  JURIDICA = 'JURIDICA'
};



export interface CreateProcess {
  id?: number
  isCNJ: boolean
  caseNumber: string
  oldCaseNumber: string
  isEletronic: boolean
  instance: InstanceType
  phaseId: number
  eletronicSystemId: number
  actionTypeId: number
  forumId: number;
  subObjectId: number
  subjectId: number
  coreId: number
  clientId: number
  adverseStakeholderId: number
  stakeholderId: number,
  distributionDate: Date
  quoteDate: Date
  description: string;
  stakeholderPosition: string;
  adversePosition: string;
  lawyerProcess: number[],
}

export interface ProcessForm {
  actionTypeId: number
  adverseLawyer: GetLawyer
  adverseStakeholder: AdverseStakeholder
  caseNumber: string
  causeValue: number
  clientId: number
  countyId: number
  description: string
  distributionDate: string
  eletronicSystemId: number
  forumId: number
  insideLawyerId: number
  instance: InstanceType
  isCNJ: boolean
  isEletronic: boolean
  lawAreaId: number
  objectId: number
  oldCaseNumber: string
  organId: number
  organNumber?: string
  originId: number
  phaseId: number
  quoteDate: string
  stakeholderId: number
  stakeholderPosition: string
  subObjectId: number
  subjectId: number
  uf: string,
  coreId:number
}

export interface Process {
  id: number
  name: string
  createAt: Date
  updateAt: Date
  isCNJ: boolean
  caseNumber: string
  oldCaseNumber: string
  isEletronic: boolean
  uf: string
  instance: InstanceType
  origin: Origin
  phase: Phase
  eletronicSystem: EletronicSystem
  actionType: ActionType
  object: Object
  lawArea: LawArea
  subject: Subject
  coreId: number
  client: Client
  adverseStakeholder: AdverseStakeholder
  county: County
  userId: number
  distributionDate: Date
  quoteDate: Date
  description: string
}

export interface Client {
  id: number
  createAt: Date
  updateAt: Date
  name: string
  stakeholderId: number
}

export interface Stakeholder {
  id: number
  createAt: Date
  updateAt: Date
  name: string
  stakeholderPositionId: number
}

export interface StakeholderPosition {
  id: number
  createAt: Date
  updateAt: Date
  name: string
}

export interface AdverseStakeholder {
  id?: number
  type: string
  cpfCnpj: string;
  email: string;
  lawyerName: string;
  oabLawyer: string;
  phone: string;
  position: string;
  ufOab: string;
  name: string
}

export interface EletronicSystem {
  id: number
  name: string
}

export interface Object {
  id: number
  name: string
  subObjectId: number
}

export interface SubObject {
  id: number
  name: string
}

export interface LawArea {
  id: number
  name: string
}

export interface LawSubArea {
  id: number
  name: string
}

export interface Subject {
  id: number
  name: string
}

export interface Phase {
  id: number
  name: string
}

export interface Origin {
  id: number
  createAt: Date
  updateAt: Date
  name: string
  lawAreaId: number

}

export interface Organ {
  id: number
  name: string
  organNumber: string
}

export interface ActionType {
  id: number
  name: string
}

export interface County {
  id: number
  createAt: Date
  updateAt: Date
  associatedUf: string
  isActive: boolean
  forumId: number
}

export interface Forum {
  id: number
  createAt: Date
  updateAt: Date
  name: string
  associatedLawArea: string
}

export interface IsEletronic {
  label: string
  value: boolean
}

export interface Ufs {
  id: number;
  name: string
}

