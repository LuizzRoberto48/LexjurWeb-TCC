import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinArray'
})
export class JoinArrayPipe implements PipeTransform {

  transform(value: any[], delimiter: string = ', '): string {
    return value.join(delimiter);
  }

}