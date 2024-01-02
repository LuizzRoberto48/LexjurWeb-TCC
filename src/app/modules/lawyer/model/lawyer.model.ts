export interface GetLawyer {
  id?: number;
  oab: string;
  ufOab: string;
  name?: string;
}

export interface BasicLawyer {
  id: number;
  oab: string;
  name: string;
}

export interface LawyerFields {
  oab?: string;
  ufOab?: string;
  name?: string;
  coreId?: number;
}

export interface CreateLawyer{
  id?: number;
  oab: string;
  person?: Person;
  ufOab: string;
  personId?: number;
  userId?: number;
}

export interface UpdateLawyer{
  name: string;
  oab: string;
  email: string;
  postalCode: string;
  city: string;
  district: string;
  street: string;
  number: number;
  complement: number
  uf: string;
  ufOab: string;
  roleEnum: string;
}

export interface Person{
  name: string;
  postalCode?: string;
  uf?: string;
  city?: string;
  district?: string;
  street?: string;
  number?: string;
  complement?: string;
}