import { BaseResourceModel } from 'app/global/base-http/base-http.model';

export interface IDeadlineTrackerTypes {
  id: number;
  label: string;
}

export class DeadlineTrackerTypes extends BaseResourceModel {
  constructor(readonly deadlineTrackerTypes: IDeadlineTrackerTypes) {
    super();
  }

  static fromJson(jsonData: IDeadlineTrackerTypes): IDeadlineTrackerTypes {
    const { id, label } = jsonData;
    return { id, label };
  }
}
