import { County, Forum, InstanceType, Organ, Origin } from "app/core/process/models/process.model";

export interface GetResource {
  id?:number;
  number: string;
  origin:string;
  uf:string;
  county:string;
  forum:string;
  organ:string;
  instance:InstanceType;
  status:boolean;
  resourceType:string

}