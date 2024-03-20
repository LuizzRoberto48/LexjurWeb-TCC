export type ExportProcess = {
  status?: string;
  insideLawyer?: number;
  rangeDate?: RangeDate;
  columns:{name:string, label:string}[]
};

export type RangeDate = {
  start: string;
  end: string;
};
