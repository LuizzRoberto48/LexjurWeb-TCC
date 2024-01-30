import { BaseResourceModel } from 'app/global/base-http/base-http.model';
import { ProcessSmall } from 'app/modules/process/models/process.model';

export interface GetProcessGuarantee {
  id: number;
  guarantee: string;
  process?: ProcessSmall;
  price: number;
  date: string;
  observation: string;
}

export interface CreateProcessGuarantee {
  id: number;
  guarantee: string;
  processId: number;
  price: number;
  date: string;
  observation: string;
}

export class ProcessGuarantee extends BaseResourceModel {
  constructor(readonly guarantee: GetProcessGuarantee) {
    super();
  }

  static fromJson(jsonData: GetProcessGuarantee): GetProcessGuarantee {
    return jsonData;
  }
}
