import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Ufs } from 'app/global/utils/get-ufs';
import { LawyerFormService } from 'app/modules/lawyer/lawyer-form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lawyer-address-form',
  templateUrl: './address-form.component.html',
})
export class LawyerAddressFormComponent {
  form: FormGroup;
  subs:Subscription = new Subscription()

  constructor(private laywerForm: LawyerFormService) {
    laywerForm.getLocalStorage('addressInfoForm');
    this.form = this.laywerForm.addressForm;
  }

  ngOnInit() {
    this.formChangeEvent();
  }

  formChangeEvent() {
    this.subs = this.form.valueChanges.subscribe((value) => {
      if (this.form.valid) this.save();
    });
  }

  get ufs() {
    return Ufs;
  }

  save() {
    this.laywerForm.setLocalStorage(this.form.value, 'addressInfoForm');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
