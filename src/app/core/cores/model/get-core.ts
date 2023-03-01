export interface Core {
  id?:number;
  name:string;
  createAt:Date;
  updateAt:Date;
}

export interface LocalCore {
  id:number;
  name:string;
}