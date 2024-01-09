import { BaseResourceModel } from 'app/global/base-http/base-http.model';
import { SmallResource } from 'app/modules/resource/model/resource.model';
import { ProcessSmall } from '../../process/models/process.model';

export interface ProcessProgress {
  resource?: SmallResource;
  type: { id: number; name: string };
  process: ProcessSmall;
  createAt: string;
  desc: string;
}

export class ProcessProgress extends BaseResourceModel {
  constructor(readonly deadlineTracker: ProcessProgress) {
    super();
  }

  static fromJson(jsonData: ProcessProgress): ProcessProgress {
    return jsonData;
  }
}
