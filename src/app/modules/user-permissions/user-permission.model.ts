import { BaseResourceModel } from 'app/global/base-http/base-http.model';
import { ProfilePanel } from '../user/profile/models/panel.model';

export const PERMISSIONCREATE = 'permissionCreate'
export const PERMISSIONEDIT = 'permissionEdit'
export const PERMISSIONLIST = 'permissionList'
export interface GetUserPermission {
  id?: number;
  name: string;
  description: string;
  permissionFeatures: GetPermissionFeature[];
}

export interface CreateUserPermission {
  id?: number;
  name: string;
  description: string;
  permissionFeatures: PermissionFeatureDTO[];
}

export interface PermissionFeatureDTO {
  featureId: number;
  roleId: number;
}

export interface GetPermissionFeature {
  feature: GetFeatureRole
  role:GetFeatureRole
}

export interface GetFeatureRole {
  id?: number;
  name: string;
  label?: string;
}

export class UserPermission extends BaseResourceModel {
  constructor(readonly userPermission?: GetUserPermission) {
    super();
  }

  static fromJson(jsonData: GetUserPermission): GetUserPermission {
    return jsonData;
  }

  get panels():ProfilePanel[] {
    return [
      {
        id: PERMISSIONLIST,
        icon: 'heroicons_solid:lock-closed',
        title: 'Permissões',
        description: 'Gerencie as permissões dos seus usuários',
        descIcon: 'heroicons_solid:key'
      },
      {
        id: PERMISSIONCREATE,
        icon: 'heroicons_solid:lock-closed',
        title: 'Criar Permissão',
        description: 'Crie as permissões com suas respectivas regras para acesso dos seus usuários',
        descIcon: 'heroicons_solid:key'
      },
      {
        id: PERMISSIONEDIT,
        icon: 'heroicons_solid:lock-closed',
        title: 'Editar Permissão',
        description: 'Edite permissão com suas respectivas regras para acesso dos seus usuários',
        descIcon: 'heroicons_solid:key'
      },
    ]
  }
}
