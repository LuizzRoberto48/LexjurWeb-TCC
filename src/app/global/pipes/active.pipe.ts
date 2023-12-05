import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'status' })
export class ActivePipe implements PipeTransform {

  transform(value: any): any {
    return value ? 'Ativo' : 'Inativo';
  }
}