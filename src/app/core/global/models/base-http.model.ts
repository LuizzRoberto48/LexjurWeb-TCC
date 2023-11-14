export abstract class BaseResourceModel {
  id?: number;
}

export interface ParamsModel {
  name:string;
  value: string | number;
}