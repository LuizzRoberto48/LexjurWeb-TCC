import { BaseResourceModel } from 'app/global/base-http/base-http.model';
import { ProgressStatus } from 'app/global/pipes/steps-progress.pipe';
import { SmallResource } from 'app/modules/resource/model/resource.model';

type NameTypes = 'recurso' | 'processo';
export interface DeadlineProcessWithResources {
  name: NameTypes;
  number: string;
}

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
  deadlineTrackerSubType: IDeadlineTrackerSubType;
  process: any;
  criticalDeadline: string;
  internalDeadline: string;
  manager: IManager;
  status: ProgressStatus;
  local?: string;
  note?: string;
}

export interface CreateDeadlineTracker {
  id: number;
  processId: number;
  processNumber: DeadlineProcessWithResources;
  subType: number;
  manager: number;
  internDeadline: string;
  criticalDeadline: string;
  status: Status;
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
