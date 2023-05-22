import { County, Forum, InstanceType, Organ, Origin } from "app/core/process/models/process.model";

export interface GetResource {
  id?:number;
  number: string;
  origin:Origin;
  uf:string;
  county:County;
  forum:Forum;
  organ:Organ;
  instance:InstanceType;
  status:boolean;
  resourceType:string

}