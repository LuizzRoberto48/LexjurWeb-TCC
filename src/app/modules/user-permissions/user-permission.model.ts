import { BaseResourceModel } from 'app/global/base-http/base-http.model';

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
  constructor(readonly userPermission: GetUserPermission) {
    super();
  }

  static fromJson(jsonData: GetUserPermission): GetUserPermission {
    return jsonData;
  }
}
