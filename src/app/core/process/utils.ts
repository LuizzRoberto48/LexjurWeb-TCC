import { FuseConfirmationConfig } from '../../../@fuse/services/confirmation'

export const configDialog = (itemName: string) => {
  const config: FuseConfirmationConfig = {
    title: `Você deseja remover este processo ${itemName}`,
    message: `Este processo não pode ser desfeito`,
    icon: {
      color: 'warning',
      show: true
    },
    actions: {
      confirm: {
        label: 'Remover'
      },
      cancel: {
        label: 'Cancelar'
      }
    },
  }
  return config;
}