import { BaseResourceModel } from 'app/global/base-http/base-http.model';
import { ProcessSmall } from '../process/models/process.model';

export interface GetProcessExpenses {
  id: number;
  type: string;
  process?: ProcessSmall;
  price: number;
  expirationDate: string;
  paymentDate: string;
  isRefundable: boolean;
  observation: string;
}

export interface CreateProcessExpenses {
  id?: number;
  type: string;
  processId: number;
  price: number;
  expirationDate: Date;
  paymentDate: Date;
  isRefundable: boolean;
  observation: string;
}

export class ProcessExpenses extends BaseResourceModel {
  constructor(readonly expenses: GetProcessExpenses) {
    super();
  }

  static fromJson(jsonData: GetProcessExpenses): GetProcessExpenses {
    return jsonData;
  }
}
