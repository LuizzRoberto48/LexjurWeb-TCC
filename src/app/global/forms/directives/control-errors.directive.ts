import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Host,
  Inject,
  Input,
  Optional,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { EMPTY, merge, Observable } from 'rxjs';
import { ControlErrorComponent } from '../control-error.component';

import { FORM_ERRORS } from '../forms-error.provider';
import { ControlErrorContainerDirective } from './control-error-container.directive';
import { FormSubmitDirective } from './form-subimit.directive';

@Directive({
  selector: '[formControl][formUtility], [formControlName][formUtility]',
})
export class ControlErrorsDirective implements OnInit {
  @Input() form: FormSubmitDirective; // Use an Input decorator for better clarity
  submit$: Observable<Event>;
  container: ViewContainerRef;
  ref: ComponentRef<ControlErrorComponent>;

  constructor(
    private control: NgControl,
    @Optional() @Host() @Inject(FORM_ERRORS) private errors,
    private vcr: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    @Optional() private controlErrorContainer: ControlErrorContainerDirective,
  ) {}

  ngOnInit(): void {
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
    this.container = this.controlErrorContainer
      ? this.controlErrorContainer.vcr
      : this.vcr;

    merge(this.control.valueChanges, this.submit$).subscribe(() => {
      const controlErrors = this.control.errors;
      this.updateErrorDisplay(controlErrors);
    });
  }

  private updateErrorDisplay(controlErrors: any): void {
    console.log(controlErrors)
    if (controlErrors) {
      const [firstKey, firstMessage] = Object.entries(controlErrors)[0];
      const getError = this.errors ? this.errors[firstKey] : null;
      const text = getError ? getError(firstMessage) : firstMessage;
      this.setError(text);
    } else {
      this.setError(null);
    }
  }

  private setError(text: string): void {
    if (!this.ref) {
      const factory = this.resolver.resolveComponentFactory(ControlErrorComponent);
      this.ref = this.container.createComponent(factory);
    }
    this.ref.instance.text = text;
  }
}