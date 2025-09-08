import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'app/global/forms/custom-validators';
import { Core } from '../cores/model/get-core';
import { UserPermission } from '../user-permissions/user-permission.model';
import {
  AddressLawyerForm,
  BasicLawyerForm,
  CompleteLawyer,
} from './model/lawyer.model';

type formTypes =
  | 'basicInfoForm'
  | 'addressInfoForm'
  | 'coreInfoForm'
  | 'permissionInfoForm'
  | 'selectedCoresObj'
  | 'selectedPermissionObj';

type listType = 'selectedCoresObj' | 'selectedPermissionObj';

@Injectable({
  providedIn: 'root',
})
export class LawyerFormService {
  selectedCores: Core[] = [];
  selectedPermission: UserPermission;
  editedLawyer: CompleteLawyer;

  private basicInfoForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    birthday: new FormControl(''),
    oab: new FormControl(''),
    ufOab: new FormControl(''),
    notes: new FormControl(''),
  });

  private addressInfoForm: FormGroup = new FormGroup({
    postalCode: new FormControl('', {
      validators: [CustomValidators.cep],
    }),
    uf: new FormControl(''),
    city: new FormControl(''),
    district: new FormControl(''),
    street: new FormControl(''),
    number: new FormControl(''),
    complement: new FormControl(''),
  });

  private coreInfoForm: FormGroup = new FormGroup({
    coreId: new FormControl([], { validators: [Validators.required] }),
  });

  private permissionInfoForm: FormGroup = new FormGroup({
    permissionId: new FormControl(null, { validators: [Validators.required] }),
    master: new FormControl(false),
  });

  get basicForm(): FormGroup {
    return this.basicInfoForm;
  }

  setBasicForm(formValues: BasicLawyerForm) {
    this.basicInfoForm.patchValue({ ...formValues });
    this.setLocalStorage(formValues, 'basicInfoForm');
  }

  get addressForm(): FormGroup {
    return this.addressInfoForm;
  }

  setAddressForm(values: AddressLawyerForm) {
    this.addressInfoForm.patchValue({ ...values });
    this.setLocalStorage(values, 'addressInfoForm');
  }

  get coreForm(): FormGroup {
    return this.coreInfoForm;
  }

  setCoreForm(core: { id: number; name: string }[]) {
    const coreIds = core.map((c) => c.id);
    this.coreInfoForm.patchValue({ coreId: coreIds });
    this.setLocalStorage({ coreId: coreIds }, 'coreInfoForm');
    this.setLocalStorage(core, 'selectedCoresObj');
  }

  get permissionForm(): FormGroup {
    return this.permissionInfoForm;
  }

  setPermissionForm(permission: any) {
    this.permissionInfoForm.patchValue({
      permissionId: permission?.id,
      master: false,
    });
    this.setLocalStorage(
      { permissionId: permission?.id, master: false },
      'permissionInfoForm',
    );
    this.setLocalStorage({ ...permission }, 'selectedPermissionObj');
  }

  setLocalStorage(value: any, formType: formTypes): void {
    const serializedFormData = JSON.stringify(value);
    sessionStorage.setItem(formType, serializedFormData);
  }

  getLocalStorage(formType: formTypes) {
    const serializedFormData = localStorage.getItem(formType);
    if (serializedFormData) {
      const formData = JSON.parse(serializedFormData);
      this[formType].setValue(formData);
    }
  }

  getCoresFromLocalStorage(formType: listType) {
    const serializedFormData = localStorage.getItem(formType);
    if (serializedFormData) {
      return JSON.parse(serializedFormData);
    }
  }

  clearAllFromLocalStorage() {
    sessionStorage.removeItem('basicInfoForm');
    sessionStorage.removeItem('addressInfoForm');
    sessionStorage.removeItem('coreInfoForm');
    sessionStorage.removeItem('permissionInfoForm');
    sessionStorage.removeItem('selectedCoresObj');
    sessionStorage.removeItem('selectedPermissionObj');
  }

  clearForms() {
    this.basicInfoForm.reset();
    this.addressInfoForm.reset();
    this.coreInfoForm.reset();
    this.permissionInfoForm.reset();
  }
}
