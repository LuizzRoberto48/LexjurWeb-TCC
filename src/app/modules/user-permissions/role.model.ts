import { BaseResourceModel } from 'app/global/base-http/base-http.model';

export interface GetRole {
  id?: number;
  name: string;
  label: string;
}

export class PermissionRole extends BaseResourceModel {
  constructor(readonly role: GetRole) {
    super();
  }

  static fromJson(jsonData: GetRole): GetRole {
    return jsonData;
  }
}
