import {
  AfterViewInit,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Host,
  Inject,
  OnInit,
  Optional,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormField, MAT_FORM_FIELD } from '@angular/material/form-field';
import { EMPTY, merge, Observable, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { ControlErrorComponent } from '../control-error.component';
import { FormSubmitDirective } from './form-subimit.directive';
import { FORM_ERRORS } from '../forms-error.provider';
import { ControlErrorContainerDirective } from './control-error-container.directive';

@Directive({
  selector: `mat-error[ga-form-field-errors]`,
})
export class MatControlErrorsDirective implements AfterViewInit {
  private destroy$ = new Subject<void>();
  private refs: ComponentRef<ControlErrorComponent>[] = [];
  private submit$: Observable<Event>;
  private container: ViewContainerRef;
  private control: NgControl;

  constructor(
    @Optional() @Host() @Inject(MAT_FORM_FIELD) private formField: MatFormField,
    @Optional() @Host() private form: FormSubmitDirective,
    @Inject(FORM_ERRORS) private errors,
    @Optional() controlErrorContainer: ControlErrorContainerDirective,
    private vcr: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
  ) {
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
    this.container = controlErrorContainer
      ? controlErrorContainer.vcr
      : this.vcr;
  }

  ngAfterViewInit() {
    this.control = this.getNgControl(this.formField);
    if(!this.control?.statusChanges) return;
    merge(this.control.statusChanges.pipe(startWith(null)), this.submit$)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
        const controlErrors = this.control.errors;
        this.handleControlErrors(controlErrors);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleControlErrors(errors: any) {
    this.clearErrors();
    if (errors) {
      Object.entries(errors).forEach(([key, value], index) => {
        const getError = this.errors[key];
        const text = getError ? getError(value) : value;
        if (Array.isArray(text)) {
          text.forEach((t, i) => this.setError(t, i));
        } else {
          this.setError(text);
        }
      });
    }
  }

  private clearErrors() {
    this.refs.forEach((ref) => ref.destroy());
    this.refs = [];
  }

  private setError(text: string, index = 0) {
    const factory = this.resolver.resolveComponentFactory(
      ControlErrorComponent,
    );
    if (!this.refs[index]) {
      this.refs[index] = this.container.createComponent(factory);
    }
    this.refs[index].instance.text = text;
  }

  private getNgControl(formField: MatFormField): NgControl {
    return <NgControl>formField._control.ngControl;
  }
}
