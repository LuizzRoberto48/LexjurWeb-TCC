import { BaseResourceModel } from 'app/global/base-http/base-http.model';
import { LossProbability } from 'app/modules/process-files/models/upload-process-files';


export interface GetProcessRequest extends BaseResourceModel {
  request: string;
  date: string;
  lossProbability: LossProbability;
  value: number;
  provisionedValue: number;
}

export interface CreateProcessRequest extends BaseResourceModel {
  request: string;
  processId: number;
  date: string;
  lossProbability: LossProbability;
  value: number;
  provisionedValue: number;
}

export class ProcessRequestDTO extends BaseResourceModel {
  constructor(readonly requests: GetProcessRequest) {
    super();
  }

  static fromJson(jsonData: GetProcessRequest): GetProcessRequest {
    return jsonData;
  }
}
