import { BaseResourceModel } from 'app/global/base-http/base-http.model';
import { GetUser } from 'app/modules/auth/models/user.model';
import { ProfilePanel } from 'app/modules/user/profile/models/panel.model';

export const LAWYERCREATE = 'LawyerCreate';
export const LAWYERNEDIT = 'LawyerEdit';
export const LAWYERLIST = 'LawyerList';
export const LAWYERDETAIL = 'LawyerDetail';

export interface BasicLawyerForm {
  id?: number;
  oab: string;
  ufOab: string;
  name: string;
  birthday?: string;
  email: string;
  notes: string;
}

export interface AddressLawyerForm {
  postalCode?: string;
  uf?: string;
  city?: string;
  district?: string;
  street: string;
  number: string;
  complement?: string;
}

export interface GetLawyer {
  id?: number;
  oab: string;
  ufOab: string;
  name?: string;
}

export interface GetLawyerSmall {
  id: number;
  name: string;
  email: string;
  profile?: string;
}

export interface GetLawyerPageable {
  totalItems: number;
  lawyers: GetLawyerSmall[];
}

export interface BasicLawyer {
  id: number;
  oab: string;
  name: string;
}

export interface LawyerFields {
  oab?: string;
  ufOab?: string;
  lName?: string;
  logicalOperator?: 'AND' | 'OR';
}

export interface CreateLawyer {
  address: AddressLawyerForm;
  cores: number[];
  id?: number;
  oab: string;
  ufOab: string;
  name: string;
  birthday?: string;
  notes: string;
  user: UserLawyer;
}

export interface UserLawyer {
  permissionId: number;
  email: string;
}

export interface Person {
  name: string;
  postalCode?: string;
  uf?: string;
  city?: string;
  district?: string;
  street?: string;
  number?: string;
  complement?: string;
}

export interface CompleteLawyer {
  city: string;
  complement?: string;
  district: string;
  id: number;
  name: string;
  number: string;
  oab: string;
  postalCode: string;
  street: string;
  uf: string;
  ufOab: string;
  notes: string;
  birthday: string;
  user: GetUser;
}

export class Lawyer extends BaseResourceModel {
  constructor(readonly userPermission?: CompleteLawyer) {
    super();
  }

  static fromJson(jsonData: CompleteLawyer): CompleteLawyer {
    return jsonData;
  }

  get panels(): ProfilePanel[] {
    return [
      {
        id: LAWYERLIST,
        icon: 'heroicons_solid:identification',
        title: 'Usuários',
        description: 'Gerencie os usuários da sua empresa',
        descIcon: 'heroicons_solid:user-group',
      },
      {
        id: LAWYERCREATE,
        icon: 'heroicons_solid:identification',
        title: 'Novo usuário',
        description: 'Crie um novo usuário para seus núcleos',
        descIcon: 'heroicons_solid:user',
      },
      {
        id: LAWYERNEDIT,
        icon: 'heroicons_solid:identification',
        title: 'Editar usuário',
        description: 'Edite o usuário e seus núcleos',
        descIcon: 'heroicons_solid:user',
      },
      {
        id: LAWYERDETAIL,
        icon: 'heroicons_solid:identification',
        title: 'Usuários',
        description: 'Gerencie os usuários da sua empresa',
        descIcon: 'heroicons_solid:user-group',
      },
    ];
  }
}
