import { ProfilePanel } from "./models/panel.model";

export class ProfileHelper {

  constructor() { }

  get panels():ProfilePanel[] {
    return [
      {
        id: 'account',
        icon: 'heroicons_outline:user-circle',
        title: 'Minha conta',
        description: 'Atualize os dados da sua conta'
      },
      {
        id: 'core',
        icon: 'heroicons_outline:lock-closed',
        title: 'Meus núcleos',
        description: 'Gerêncie os núcleos que você é administrador'
      },
      {
        id: 'team',
        icon: 'heroicons_outline:user-group',
        title: 'Time',
        description: 'Gerencie os usuários de cada núcleo'
      }
    ]
  }
}