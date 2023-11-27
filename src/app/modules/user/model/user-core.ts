import { Core } from "app/modules/cores/model/get-core";

export interface UserCore {
  name:string;
  email:string;
  core:Core[]
}