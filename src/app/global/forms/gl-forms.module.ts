import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormSubmitDirective } from './directives/form-subimit.directive';
import { ControlErrorsDirective } from './directives/control-errors.directive';
import { MatControlErrorsDirective } from './directives/mat-control-errors.directive';
import { ContainerErrorsDirective } from './directives/mat-group-errors.directive';
import { GroupErrorsDirective } from './directives/group-errors.directive';
import { ControlErrorComponent } from './control-error.component';
import { ControlErrorContainerDirective } from './directives/control-error-container.directive';

const toExport = [
  FormSubmitDirective,
  ControlErrorsDirective,
  MatControlErrorsDirective,
  ContainerErrorsDirective,
];

@NgModule({
  declarations: [
    GroupErrorsDirective,
    ControlErrorComponent,
    ControlErrorContainerDirective,
    toExport,
  ],
  exports: toExport,
  imports: [CommonModule],
})
export class GlFormsModule {}
