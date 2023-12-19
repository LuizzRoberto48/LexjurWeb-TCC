import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormSubmitDirective } from './directives/form-subimit.directive';
import { MatControlErrorsDirective } from './directives/mat-control-errors.directive';

import { ControlErrorComponent } from './control-error.component';
import { ControlErrorContainerDirective } from './directives/control-error-container.directive';

const toExport = [
  FormSubmitDirective,
  MatControlErrorsDirective,
];

@NgModule({
  declarations: [
    ControlErrorComponent,
    ControlErrorContainerDirective,
    toExport,
  ],
  exports: toExport,
  imports: [CommonModule],
})
export class GlFormsModule {}
