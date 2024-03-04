import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { GlobalModule } from 'app/shared/global.module';
import localePt from '@angular/common/locales/pt';
import { MatStepperModule } from '@angular/material/stepper';
import { LawyerFormComponent } from './lawyer-form.component';
import { LawyerBasicFormComponent } from './basic-form/basic-form.component';
import { LawyerResumeFormComponent } from './resume-form/resume-form.component';
import { LawyerPermissionFormComponent } from './permission-form/permission-form.component';
import { LawyerCoreFormComponent } from './core-form/core-form.component';
import { LawyerAddressFormComponent } from './address-form/address-form.component';
registerLocaleData(localePt);
@NgModule({
  declarations: [
    LawyerFormComponent,
    LawyerBasicFormComponent,
    LawyerResumeFormComponent,
    LawyerPermissionFormComponent,
    LawyerCoreFormComponent,
    LawyerAddressFormComponent,
  ],
  imports: [CommonModule, GlobalModule, MatStepperModule],
  exports: [
    LawyerFormComponent,
    LawyerBasicFormComponent,
    LawyerResumeFormComponent,
    LawyerPermissionFormComponent,
    LawyerCoreFormComponent,
    LawyerAddressFormComponent,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
})
export class LawyerFormModule {}
