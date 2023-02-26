import { Core } from "app/core/cores/model/get-core";

export interface UserCore {
  name:string;
  email:string;
  core:Core[]
}