import { GetLawyer } from 'app/modules/lawyer/model/lawyer.model';

export enum ProcessStatus {
  ACTIVE = 'Ativo',
  FINISHED = 'Encerrado',
  WAIT_TO_FINISHED = 'Aguardando Encerramento',
}

export enum InstanceType {
  PRIMEIRA = 'PRIMEIRA',
  SEGUNDA = 'SEGUNDA',
  TERCEIRA = 'TERCEIRA',
}

export enum PersonType {
  FISICA = 'Física',
  JURIDICA = 'Jurídica',
}

export interface GetProcessPageable {
  totalItems: number;
  process: GetProcess[];
}

export interface GetProcess {
  id?: number;
  LawyerProcess: any;
  caseNumber: string;
  oldCaseNumber: string;
  subject: string;
  lawyer?: string;
  distributionDate: string;
  quoteDate: string;
  instance: string;
  causeValue: number;
  insideLawyer: any;
  outsideLawyer: any;
}

export interface CreateProcess {
  id?: number;
  isCNJ: boolean;
  caseNumber: string;
  oldCaseNumber: string;
  isEletronic: boolean;
  instance: InstanceType;
  phaseId: number;
  eletronicSystemId?: number;
  actionTypeId: number;
  forumId: number;
  subObjectId: number;
  subjectId: number;
  coreId: number;
  adverseStakeholder: AdverseStakeholder;
  stakeholderId: number;
  distributionDate: any;
  quoteDate: any;
  description: string;
  stakeholderPosition: string;
  adversePosition: string;
  lawyerProcess: number[];
  causeValue: string;
  organNumber?: string;
}

export interface ProcessForm {
  id?: number;
  actionTypeId: number;
  adverseLawyer: GetLawyer;
  adverseStakeholder: AdverseStakeholder;
  caseNumber: string;
  causeValue: number;
  clientId: number;
  countyId: number;
  description: string;
  distributionDate: any;
  eletronicSystemId: number;
  forumId: number;
  insideLawyerId: number;
  instance: InstanceType;
  isCNJ: boolean;
  isEletronic: boolean;
  lawAreaId: number;
  objectId: number;
  oldCaseNumber: string;
  organId: number;
  organNumber?: string;
  lawSubAreaId: number;
  originId: number;
  phaseId: number;
  quoteDate: any;
  stakeholderId: number;
  stakeholderPosition: string;
  adversePosition: string;
  subObjectId: number;
  subjectId: number;
  uf: string;
  coreId: number;
}

export interface Process {
  id: number;
  status:any
  createAt: Date;
  updateAt: Date;
  isCNJ: boolean;
  ActionType: any;
  AdverseStakeholder: AdverseStakeholder;
  EletronicSystem: any;
  LawSubArea: any;
  caseNumber: string;
  Organ: any;
  Forum: any;
  Phase: any;
  Stakeholder: any;
  SubObject: any;
  Subject: any;
  oldCaseNumber: string;
  isEletronic: boolean;
  uf: string;
  instance: InstanceType;
  organNumber: string | undefined;
  origin: Origin;
  phase: Phase;
  eletronicSystem: EletronicSystem;
  actionType: ActionType;
  object: Object;
  lawArea: LawArea;
  subject: Subject;
  coreId: number;
  client: Client;
  causeValue: string;
  LawyerProcess?: any;
  county: County;
  userId: number;
  distributionDate: Date;
  quoteDate: Date;
  description: string;
  stakeholderPosition: string;
  adversePosition: string;
}

export interface ProcessSmall {
  id: number;
  caseNumber: string;
  oldCaseNumber: string;
  causeValue: any;
  distributionDate: Date;
  quoteDate: Date;
}

export interface Client {
  id: number;
  createAt: Date;
  updateAt: Date;
  name: string;
  stakeholderId: number;
}

export interface Stakeholder {
  id: number;
  createAt: Date;
  updateAt: Date;
  name: string;
  stakeholderPositionId: number;
}

export interface StakeholderPosition {
  id: number;
  createAt: Date;
  updateAt: Date;
  name: string;
}

export interface AdverseStakeholder {
  id?: number;
  name: string;
  type: string;
  cpfCnpj: string;
  email: string;
  phone: string;
}

export interface EletronicSystem {
  id: number;
  name: string;
}

export interface Object {
  id: number;
  name: string;
  subObjectId: number;
}

export interface SubObject {
  id: number;
  name: string;
}

export interface LawArea {
  id: number;
  name: string;
}

export interface LawSubArea {
  id: number;
  name: string;
}

export interface Subject {
  id: number;
  name: string;
}

export interface Phase {
  id: number;
  name: string;
}

export interface Origin {
  id: number;
  createAt: Date;
  updateAt: Date;
  name: string;
  lawAreaId: number;
}

export interface Organ {
  id: number;
  name: string;
  organNumber: string;
}

export interface ActionType {
  id: number;
  name: string;
}

export interface County {
  id: number;
  createAt: Date;
  updateAt: Date;
  associatedUf: string;
  isActive: boolean;
  forumId: number;
}

export interface Forum {
  id: number;
  createAt: Date;
  updateAt: Date;
  name: string;
  associatedLawArea: string;
}

export interface IsEletronic {
  label: string;
  value: boolean;
}
