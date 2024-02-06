export interface Core {
  id?:number;
  name:string;
  description:string;
  createAt:Date;
  updateAt:Date;
}

export interface LocalCore {
  id:number;
  name:string;
}