import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Ufs } from 'app/global/utils/get-ufs';
import { LawyerFormService } from 'app/modules/lawyer/lawyer-form.service';
import { MY_FORMATS } from 'app/shared/date-picker-formats';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lawyer-basic-form',
  templateUrl: './basic-form.component.html',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class LawyerBasicFormComponent {
  form: FormGroup;
  subs: Subscription = new Subscription();
  constructor(private laywerForm: LawyerFormService) {
    laywerForm.getLocalStorage('basicInfoForm');
    this.form = laywerForm.basicForm;
  }

  ngOnInit() {
    this.formChangeEvent();
  }

  formChangeEvent() {
    this.subs = this.form.valueChanges.subscribe((value) => {
      if (this.form.valid) this.save();
    });
  }

  save() {
    this.laywerForm.setLocalStorage(this.form.value, 'basicInfoForm');
  }

  get ufs() {
    return Ufs;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
