import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { LawyerFormService } from 'app/modules/lawyer/lawyer-form.service';
import { UserPermissionsService } from 'app/modules/user-permissions';
import { GetUserPermission } from 'app/modules/user-permissions/user-permission.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lawyer-permission-form',
  templateUrl: './permission-form.component.html',
})
export class LawyerPermissionFormComponent {
  form: FormGroup;
  permissions: GetUserPermission[];
  subs: Subscription = new Subscription();

  constructor(
    private laywerForm: LawyerFormService,
    private permissionService: UserPermissionsService,
  ) {
    laywerForm.getLocalStorage('permissionInfoForm');
  }

  ngOnInit() {
    this.findPermissions();
    this.form = this.laywerForm.permissionForm;
    this.formChangeEvent();
  }

  formChangeEvent() {
    this.subs = this.form.valueChanges.subscribe((value) => {
      if (this.form.valid) this.save();
    });
  }

  save() {
    this.laywerForm.setLocalStorage(this.form.value, 'permissionInfoForm');
  }

  selectChange(event: MatSelectChange) {
    const found = this.permissions.find((c) => c.id == event.value);
    this.laywerForm.setLocalStorage(found, 'selectedPermissionObj');
    //this.laywerForm.setPermissionForm()
  }

  cbxAdmin() {
    const master = this.form.get('master').value;
    if (master) {
      this.form.get('permissionId').setValue(null)
      this.form.get('permissionId').disable();
      this.form.get('permissionId').setValidators([]);
      this.form.get('permissionId')?.updateValueAndValidity();
    } else {
      this.form.get('permissionId').enable();
      this.form.get('permissionId').setValidators([Validators.required]);
      this.form.get('permissionId')?.updateValueAndValidity();
    }
  }

  findPermissions() {
    this.permissionService.findAll().subscribe({
      next: (permissions: GetUserPermission[]) => {
        this.permissions = permissions;
      },
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
