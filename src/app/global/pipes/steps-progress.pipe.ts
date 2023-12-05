import { Pipe, PipeTransform } from '@angular/core';

export type Status = 'CANCELED' | 'INPROGRESS' | 'COMPLETED';

interface StatusClass {
  label: string;
  cssClass: { [key: string]: boolean };
}

const statusClassMappings: { [key in Status]: StatusClass } = {
  CANCELED: {
    label: 'Cancelado',
    cssClass: {
      'bg-red-200': true,
      'text-red-800': true,
      'dark:bg-red-600': true,
      'dark:text-red-50': true,
    },
  },
  INPROGRESS: {
    label: 'Em progresso',
    cssClass: {
      'bg-yellow-200': true,
      'text-yellow-800': true,
      'dark:bg-yellow-600': true,
      'dark:text-yellow-50': true,
    },
  },
  COMPLETED: {
    label: 'Completo',
    cssClass: {
      'bg-green-200': true,
      'text-green-800': true,
      'dark:bg-green-600': true,
      'dark:text-green-50': true,
    },
  },
};

const deafultClass: Omit<StatusClass, 'label'> = {
  cssClass: {
    'bg-gray-200': true,
    'text-gray-800': true,
    'dark:bg-gray-600': true,
    'dark:text-gray-50': true,
  },
};

@Pipe({ name: 'stepProgress' })
export class StepsPipe implements PipeTransform {
  transform(status: string): StatusClass {
    return (
      statusClassMappings[status] || {
        label: status,
        ...deafultClass,
      }
    );
  }
}
