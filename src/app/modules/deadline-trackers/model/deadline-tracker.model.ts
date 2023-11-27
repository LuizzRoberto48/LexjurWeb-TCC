
import { BaseResourceModel } from 'app/global/base-http/base-http.model';
import { SmallResource } from 'app/modules/process/resource/model/resource.model';

export enum Status {
  INPROGRESS,
  COMPLETED,
  CANCELED,
}

export interface IManager {
  id: number;
  oab: string;
  name: string;
}

export interface IDeadlineTrackerType {
  id: number;
  label: string;
}

export interface IDeadlineTrackerSubType {
  id: number;
  label: string;
  deadlineTrackerType: IDeadlineTrackerType;
}

export interface IDeadlineTracker {
  id: number;
  resource?: SmallResource;
  processNumber: string;
  deadlineTrackerSubType: IDeadlineTrackerSubType;
  subType: any;
  processId: number;
  criticalDeadline: Date;
  manager: IManager;
  status: Status;
  internDeadline: Date;
  local: string;
  note: string;
}

export class DeadlineTracker extends BaseResourceModel {
  constructor(readonly deadlineTracker: IDeadlineTracker) {
    super();
  }

  static fromJson(jsonData: IDeadlineTracker): IDeadlineTracker {
    return jsonData;
  }
}
