import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

@Component({
  template: ` {{ _text }} `,
  styles: [
    `
      .help {
        display: inline-block;
        color: #cc6666;
        font-size: 1.8em;
      }
      ::ng-deep .mat-mdc-form-field, ::ng-deep .mat-mdc-form-field-error {
        display: initial;
        color:var(--mdc-theme-error, #dc2626) !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlErrorComponent {
  _text: string;
  _hide = true;

  @Input() set text(value) {
    if (value !== this._text) {
      this._text = value;
      this._hide = !value;
      this.cdr.detectChanges();
    }
  }

  constructor(private cdr: ChangeDetectorRef) {}
}
