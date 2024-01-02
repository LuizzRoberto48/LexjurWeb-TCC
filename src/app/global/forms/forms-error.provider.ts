import { InjectionToken } from '@angular/core';

export const defaultErrors = {
    required: (error) => `Este campo é obrigatório.`,
    minlength: ({ requiredLength, actualLength }) => `Esperado ${requiredLength} mas foi inserido ${actualLength}.`,
    mask: ({ actualValue, requiredMask }) => `Não corresponde ao padrão ${requiredMask}.`,
    email: (msg) => 'E-mail inválido.',
    matDatepickerParse: () => 'Data em formato inválido.'
}

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
    providedIn: 'root',
    factory: () => defaultErrors
});

export const COMPONENT_FORM_ERRORS = new InjectionToken('COMPONENT_FORM_ERRORS', {
    providedIn: 'root',
    factory: () => defaultErrors
});