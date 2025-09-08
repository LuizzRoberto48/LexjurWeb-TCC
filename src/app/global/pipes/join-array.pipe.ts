import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinArray'
})
export class JoinArrayPipe implements PipeTransform {

  transform(value: any[], delimiter: string = ', '): string {
    console.log(value)
    if(!value) return '';
    return value.join(delimiter);
  }

}