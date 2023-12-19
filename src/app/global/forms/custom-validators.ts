import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { DateTime } from 'luxon';

const cnpjPattern = /^\d{2}\d{3}\d{3}\d{4}\d{2}$/;
const cpfPattern = /^\d{3}\d{3}\d{3}\d{2}$/;
export const cepPattern = /\d{8}$/;
const hexColorPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export namespace CustomValidators {
  const cnpjValidator = Validators.pattern(cnpjPattern);
  const cpfValidator = Validators.pattern(cpfPattern);

  export function cnpj(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const isCnpjInvalid = cnpjValidator(control);
    if (isCnpjInvalid) {
      return {
        cnpj: 'Não é um número válido de CNPJ',
      };
    }
    return null;
  }

  export function cpf(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const isCpfInvalid = cpfValidator(control);
    if (isCpfInvalid) {
      return {
        cpf: 'Não é um número válido de CPF',
      };
    }
    return null;
  }

  export function cpfOrCnpj(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    if (!cnpj(control) || !cpf(control)) {
      return null;
    }
    return {
      cnpj: 'Não é um número válido de CNPJ',
    };
  }

  export function cep(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    if (!value) return null;
    if (!cepPattern.test(value)) {
      return {
        cep: 'Não é um número válido de cep',
      };
    }
    return null;
  }

  export function hexColor(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    if (!value) return null;
    if (!hexColorPattern.test(value)) {
      return {
        colorControl: 'Não é um código de cor hexadecimal válido',
      };
    }
    return null;
  }
}
