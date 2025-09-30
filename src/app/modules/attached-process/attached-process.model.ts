import { BaseResourceModel } from 'app/global/base-http/base-http.model';

export interface BaseAttachedProcess {
  processId: number
  linkedProcessId: number;
}

export interface GetAttachedProcess extends BaseResourceModel {
  processId: number
  linkedProcessId: number;
  caseNumber: string;
  Stakeholder: any;
  Organ?: any;
  Forum: any;
  AdverseStakeholder: any
}

export class AttachedProcessDTO extends BaseResourceModel {
  constructor(readonly attached: GetAttachedProcess) {
    super();
  }

  static fromJson(jsonData: GetAttachedProcess): GetAttachedProcess {
    return jsonData;
  }
}
