import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Host,
  Inject,
  OnInit,
  Optional,
  ViewContainerRef,
} from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { EMPTY, merge, Observable } from 'rxjs';
import { ControlErrorComponent } from '../control-error.component';
import { FORM_ERRORS } from '../forms-error.provider';
import { FormSubmitDirective } from './form-subimit.directive';
import { ControlErrorContainerDirective } from './control-error-container.directive';

@Directive({
  selector: '[formGroup]',
})
export class GroupErrorsDirective implements OnInit {
  ref: ComponentRef<ControlErrorComponent>;
  submit$: Observable<Event>;
  container: ViewContainerRef;

  constructor(
    private control: ControlContainer,
    @Optional() @Host() private form: FormSubmitDirective,
    @Inject(FORM_ERRORS) private errors,
    private vcr: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    @Optional() controlErrorContainer: ControlErrorContainerDirective,
  ) {
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
    this.container = controlErrorContainer
      ? controlErrorContainer.vcr
      : this.vcr;
  }

  ngOnInit(): void {
    console.log('ola group')
    merge(this.control.valueChanges, this.submit$).subscribe(() => {
      const controlErrors = this.control.errors;
      if (controlErrors) {
        const [firstKey, firstMessage] = Object.entries(controlErrors)[0];
        const getError = this.errors[firstKey];
        console.log(firstKey);
        console.log(getError);
        const text = getError
          ? getError(controlErrors[firstKey])
          : firstMessage;
        this.setError(text);
      } else {
        this.setError(null);
      }
    });
  }
  setError(text: string) {
    if (!this.ref) {
      const factory = this.resolver.resolveComponentFactory(
        ControlErrorComponent,
      );
      this.ref = this.container.createComponent(factory);
    }
    this.ref.instance.text = text;
  }
}
