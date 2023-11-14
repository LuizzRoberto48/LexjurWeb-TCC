import { BaseResourceModel } from "app/core/global/models/base-http.model";

export interface ScheduleModel {
  type:any;
  subType:any;
  processId:number;
  owner:string;
  status:boolean;
  internDeadline:Date;
  local:string;
  observation:string;


}

export class Schedule extends BaseResourceModel {
  constructor(public schedule:ScheduleModel){
    super()
  }

  static fromJson(jsonData: ScheduleModel): ScheduleModel {
    return jsonData
  }
}