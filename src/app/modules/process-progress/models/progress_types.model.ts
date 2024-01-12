import { BaseResourceModel } from 'app/global/base-http/base-http.model';

export interface ProcessProgressType {
  id: number;
  name: string;
}

export class ProcessProgressTypes extends BaseResourceModel {
  constructor(readonly processProgress: ProcessProgressType) {
    super();
  }

  static fromJson({ id, name }: ProcessProgressType): ProcessProgressType {
    return { id, name };
  }
}
