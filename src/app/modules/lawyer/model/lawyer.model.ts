export interface GetLawyer {
  id?: number;
  oab: string;
  ufOab: string;
  name?: string;
}

export interface LawyerFields {
  oab?: string;
  ufOab?: string;
  name?: string;
  coreId?:number
}