export type SearchFieldsTypes = 'process' | 'deadline';

export type DateRangeType = 'rangeDate' | 'rangeDateInternDeadline';


export enum DeadlineStatus {
  INPROGRESS = 'Em andamento',
  COMPLETED = 'Encerrado',
  CANCELED = 'Cancelado',
}

export const EMPTYSELECT = '--Selecione--'