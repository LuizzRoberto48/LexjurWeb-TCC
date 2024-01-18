import { BaseResourceModel } from 'app/global/base-http/base-http.model';
import {
  PersonType,
  ProcessSmall,
} from 'app/modules/process/models/process.model';

export interface GetProcessParts extends BaseResourceModel {
  name: string;
  personType: PersonType;
  process?: ProcessSmall;
  position: string;
}

export interface CreateProcessParts extends BaseResourceModel {
  name: string;
  personType: PersonType;
  processId: ProcessSmall;
  position: string;
}

export class ProcessPartsDTO extends BaseResourceModel {
  constructor(readonly parts: GetProcessParts) {
    super();
  }

  static fromJson(jsonData: GetProcessParts): GetProcessParts {
    return jsonData;
  }
}
