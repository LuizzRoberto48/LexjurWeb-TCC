import { ProcessSmall } from 'app/modules/process/models/process.model';
import {
  DeadlineProcessWithResources,
  SmallResource,
} from 'app/modules/resource/model/resource.model';

export enum TargetFiles {
  TODOS = 'TODOS',
  PRAZO = 'PRAZO',
  RECURSO = 'RECURSO',
  PROCESSO = 'PROCESSO',
  PROGRESS = 'ANDAMENTO',
  EXPENSES = 'DESPESAS',
  GUARANTEE = 'GARANTIA',
}

export const allTargets = Object.values(TargetFiles);

export type UploadTypes =
  | 'png'
  | 'txt'
  | 'jpg'
  | 'jpeg'
  | 'excel'
  | 'pdf'
  | 'word';
export type LossProbability = 'Possível' | 'Provável' | 'Remota';

export enum LossProbabilityEnum {
  POSSIBLE = 'Possível',
  PROBABLE = 'Provável',
  REMOTE = 'Remota',
}

export const targetFilesArray = Object.keys(
  {} as { [K in TargetFiles]: null },
) as TargetFiles[];

export interface ProcessFiles {
  process: ProcessSmall;
  file: GetUploadFile;
}
export interface GetUploadFile {
  id: number;
  bucketKey: string;
  createAt: string;
  fileClassificationId: number;
  lossProbability: LossProbability;
  originalName: string;
  processId: number;
  resource?: SmallResource;
  target: TargetFiles;
  targetId: number;
  updateAt?: string;
  base64?: string;
  urlFile?: string;
  process?: ProcessSmall;
}

export interface FormUploadProcessFile {
  id?: number;
  processId: number;
  processNumber: string;
  targetId: number;
  target: string;
  fileClassificationId: number;
  createAt: string;
  lossProbability: LossProbability;
}

export interface CreateUploadProcessFile {
  id?: number;
  processId: number;
  processNumber: DeadlineProcessWithResources;
  targetId: number;
  target: string;
  fileClassificationId: number;
  createAt: string;
  lossProbability: LossProbability;
}

export interface CrudFileMethod {
  file: GetUploadFile;
  method: 'create' | 'update' | 'delete';
}
