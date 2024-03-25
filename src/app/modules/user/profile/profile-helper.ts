import { ProfilePanel } from "./models/panel.model";

export const ACCOUNTID = 'account'
export const COREID = 'core'
export const TEAMID = 'team'
export const PERMISSIONID = 'permission'
export const USERID = 'userId'

export class ProfileHelper {

  constructor() { }

  get panels():ProfilePanel[] {
    return [
      {
        id: ACCOUNTID,
        icon: 'heroicons_outline:user-circle',
        title: 'Minha conta',
        description: 'Atualize os dados da sua conta'
      },
      {
        id: COREID,
        icon: 'heroicons_outline:cube',
        title: 'Meus núcleos',
        description: 'Gerêncie os núcleos que você é administrador'
      },
      {
        id: TEAMID,
        icon: 'heroicons_outline:user-group',
        title: 'Time',
        description: 'Gerencie os usuários de cada núcleo'
      }
    ]
  }

}