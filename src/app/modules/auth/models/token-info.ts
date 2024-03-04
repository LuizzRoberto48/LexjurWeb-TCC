export interface TokenInfo {
  avatar:string;
  email:string;
  isAdmin:string;
  permissionId?:number
  exp:number;
  iat:number;
  sub:number
}