import { BaseResourceModel } from 'app/global/base-http/base-http.model';
import { GetRole } from './index';

export interface GetFeature {
  id?: number;
  name: string;
  label: string;
  roles?: GetRole[];
}

export class PermissionFeature extends BaseResourceModel {
  constructor(readonly feature: GetFeature) {
    super();
  }

  static fromJson(jsonData: GetFeature): GetFeature {
    return jsonData;
  }
}
