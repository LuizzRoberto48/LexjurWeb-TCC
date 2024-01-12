import { BaseResourceModel } from 'app/global/base-http/base-http.model';
import { DeadlineProcessWithResources, SmallResource } from 'app/modules/resource/model/resource.model';
import { ProcessSmall } from '../../process/models/process.model';

export interface ProcessProgress {
  resource?: SmallResource;
  type: { id: number; name: string };
  process: ProcessSmall;
  date: string;
  desc: string;
  processProgressTypeId?:number
}

export interface CreateProcessProgress {
  processNumber: DeadlineProcessWithResources;
  typeId: number;
  date: string;
  desc: string;
}

export class ProcessProgress extends BaseResourceModel {
  constructor(readonly processProgress: ProcessProgress) {
    super();
  }

  static fromJson(jsonData: ProcessProgress): ProcessProgress {
    return jsonData;
  }
}
