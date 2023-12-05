import { BaseResourceModel } from 'app/global/base-http/base-http.model';

export interface IDeadlineTrackerSubTypes {
  id: number;
  label: string;
}

export class DeadlineTrackerSubTypes extends BaseResourceModel {
  constructor(readonly deadlineTrackerTypes: IDeadlineTrackerSubTypes) {
    super();
  }

  static fromJson(
    jsonData: IDeadlineTrackerSubTypes,
  ): IDeadlineTrackerSubTypes {
    const { id, label } = jsonData;
    return { id, label };
  }
}
