import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LawyerFormService } from 'app/modules/lawyer/lawyer-form.service';
import { CompleteLawyer } from 'app/modules/lawyer/model/lawyer.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lawyer-form',
  templateUrl: './lawyer-form.component.html',
})
export class LawyerFormComponent {
  subscriptions: Subscription[] = [];
  editedLawyer: CompleteLawyer;
  isEdit = false;

  constructor(
    private lawyerForm: LawyerFormService,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.getLawyer();
    this.isResumeEnable();
  }

  setEditInfoIntoForms(lawyer: CompleteLawyer) {
    this.lawyerForm.setBasicForm({
      email: lawyer.user.email,
      name: lawyer.name,
      notes: lawyer.notes,
      oab: lawyer.oab,
      ufOab: lawyer.ufOab,
      birthday: lawyer.birthday,
      id: lawyer.id,
    });

    this.lawyerForm.setAddressForm({
      postalCode: lawyer.postalCode,
      uf: lawyer.uf,
      city: lawyer.city,
      district: lawyer.district,
      street: lawyer.street,
      number: lawyer.number,
      complement: lawyer.complement,
    });

    this.lawyerForm.setCoreForm(lawyer.user.cores);
    this.lawyerForm.setPermissionForm(lawyer.user?.permission);
  }

  getLawyer() {
    const subs = this._activatedRoute.data.subscribe({
      next: ({ data }) => {
        if (data) {
          this.setEditInfoIntoForms(data);
          this.isEdit = true;
        }
      },
    });
    this.subscriptions.push(subs);
  }

  get basicForm() {
    return this.lawyerForm.basicForm;
  }

  get addressForm() {
    return this.lawyerForm.addressForm;
  }

  get coreForm() {
    return this.lawyerForm.coreForm;
  }

  get permissionForm() {
    return this.lawyerForm.permissionForm;
  }

  isResumeEnable(): boolean {
    return (
      this.lawyerForm?.basicForm.valid &&
      this.lawyerForm?.addressForm.valid &&
      this.lawyerForm?.coreForm.valid &&
      this.lawyerForm?.permissionForm.valid
    );
  }

  get info() {
    const basic = this.basicForm.value;
    const address = this.addressForm.value;
    const cores = this.lawyerForm.getCoresFromLocalStorage('selectedCoresObj');
    const permission = this.lawyerForm.getCoresFromLocalStorage(
      'selectedPermissionObj',
    );
    return { basic, address, cores, permission };
  }

  ngOnDestroy() {
    this.lawyerForm.clearAllFromLocalStorage();
    this.lawyerForm.clearForms();
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
