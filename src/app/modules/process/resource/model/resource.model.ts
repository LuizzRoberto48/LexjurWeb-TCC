import { InstanceType } from 'app/modules/process/models/process.model';

export interface SmallResource {
  id: number;
  number: string;
  type: string;
}
export interface GetResource {
  id?: number;
  number: string;
  origin: string;
  uf: string;
  county: string;
  forum: string;
  organ: string;
  instance: InstanceType;
  status: boolean;
  resourceType: string;
}

export interface CreateResource {
  id?: number;
  number: string;
  type: string;
  instance: InstanceType;
  processId: number;
  organId: number;
  forumId: number;
}

export interface FormResource {
  id?: number;
  number: string;
  origin: number;
  uf: string;
  county: number;
  forum: number;
  organ: number;
  instance: string;
  resourceType: string;
}
