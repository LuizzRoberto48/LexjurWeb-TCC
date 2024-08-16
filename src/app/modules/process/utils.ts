import { HttpParams } from '@angular/common/http';
import { FuseConfirmationConfig } from '../../../@fuse/services/confirmation';

export const configDialog = (itemName: string) => {
  const config: FuseConfirmationConfig = {
    title: `Você deseja remover este processo ${itemName}`,
    message: `Este processo não pode ser desfeito`,
    icon: {
      color: 'warning',
      show: true,
    },
    actions: {
      confirm: {
        label: 'Remover',
      },
      cancel: {
        label: 'Cancelar',
      },
    },
  };
  return config;
};

export const configDialogResource = (itemName?: string) => {
  const config: FuseConfirmationConfig = {
    title: `Você deseja remover ${itemName ?? 'este item'}?`,
    message: `Este processo não pode ser desfeito`,
    icon: {
      color: 'warning',
      show: true,
    },
    actions: {
      confirm: {
        label: 'Remover',
      },
      cancel: {
        label: 'Cancelar',
      },
    },
  };
  return config;
};

export function httpParams(params: {} = {}): HttpParams {
  let httpParams = new HttpParams();
  Object.keys(params).forEach(function (key) {
    httpParams = httpParams.append(key, params[key]);
  });
  return httpParams;
}
