import { UploadTypes } from "app/modules/process-files/models/upload-process-files";


export interface UploadType {
  name: UploadTypes;
  accept: string;
  extensions: string;
  color?: string;
  label?: string;
  target?: string;
  id?:number;
}
