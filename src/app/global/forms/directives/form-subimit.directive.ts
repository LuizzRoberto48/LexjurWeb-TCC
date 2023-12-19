import { Directive, ElementRef, Host, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Directive({
  selector: 'form[formUtility]'
})
export class FormSubmitDirective {
  submit$ = fromEvent(this.element, 'submit').pipe(shareReplay(1))

  constructor(
    @Optional() @Host() private form: FormGroupDirective,
    private host: ElementRef<HTMLFormElement>
  ) { }

  get element() {
    return this.host.nativeElement;
  }
}