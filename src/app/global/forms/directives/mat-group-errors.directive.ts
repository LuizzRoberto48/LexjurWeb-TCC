import {
  AfterViewInit,
  Component,
  ComponentRef,
  Host,
  Inject,
  OnInit,
  Optional,
  ViewContainerRef,
} from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { EMPTY, merge, Observable } from 'rxjs';
import { ControlErrorComponent } from '../control-error.component';
import { FormSubmitDirective } from './form-subimit.directive';
import { FORM_ERRORS } from '../forms-error.provider';

@Component({
  selector: `ga-mat-group-error`,
  template: `{{ text }}`,
  host: {
    class: 'help is-danger',
  },
  styles: [
    `
      :host-context(.help) {
        display: inline-block;
        color: #cc6666;
        font-size: 0.75em;
        margin-bottom: 10px;
      }
    `,
  ],
})
export class ContainerErrorsDirective implements OnInit, AfterViewInit {
  ref: ComponentRef<ControlErrorComponent>;
  submit$: Observable<Event>;
  container: ViewContainerRef = this.vcr;

  text: string;

  constructor(
    @Optional() @Host() private group: ControlContainer,
    @Optional() @Host() private form: FormSubmitDirective,
    @Inject(FORM_ERRORS) private errors,
    private vcr: ViewContainerRef,
  ) {
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    merge(this.group.statusChanges, this.submit$).subscribe(() => {
      const controlErrors = this.group.errors;
      if (controlErrors) {
        const [firstKey, firstMessage] = Object.entries(controlErrors)[0];
        const getError = this.errors[firstKey];
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
    this.text = text;
  }
}
