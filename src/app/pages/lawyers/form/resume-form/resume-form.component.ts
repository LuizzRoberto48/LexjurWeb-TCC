import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { Core } from 'app/modules/cores/model/get-core';
import { LawyerFormService } from 'app/modules/lawyer/lawyer-form.service';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import {
  AddressLawyerForm,
  BasicLawyerForm,
} from 'app/modules/lawyer/model/lawyer.model';
import { GetUserPermission } from 'app/modules/user-permissions/user-permission.model';

@Component({
  selector: 'lawyer-resume-form',
  templateUrl: './resume-form.component.html',
})
export class LawyerResumeFormComponent {
  @Input() isEdit: boolean = false;
  @Input() info: {
    basic: BasicLawyerForm;
    address: AddressLawyerForm;
    cores: Core[];
    permission: GetUserPermission;
  };

  constructor(
    private lawyerService: LawyerService,
    private notification: NotificationService,
    private lawyerForm: LawyerFormService,
    private _router: Router,
  ) {}

  ngOnInit() {}

  get cores() {
    if (this.info?.cores) return this.info.cores.map((c) => c.name);
  }

  send() {
    this.isEdit ? this.update() : this.create();
  }

  update() {
    const lawyer = this.formToObj();
    this.lawyerService.update(lawyer.id, lawyer).subscribe({
      next: () => {
        this.notification.success('Usuário alterado com sucesso');
        this.lawyerForm.clearAllFromLocalStorage();
        this.lawyerForm.clearForms();
        this._router.navigateByUrl('/lawyers');
      },
    });
  }

  create() {
    const lawyer = this.formToObj();
    this.lawyerService.create(lawyer).subscribe({
      next: () => {
        this.notification.success('Usuário criado com sucesso');
        this.lawyerForm.clearAllFromLocalStorage();
        this.lawyerForm.clearForms();
        this._router.navigateByUrl('/lawyers');
      },
    });
  }

  formToObj() {
    const { basic, address, cores, permission } = this.info;
    const { id, email, birthday, ...rest } = basic;
    const lawyer = {
      ...rest,
      ...(birthday ? { birthday } : {}),
      ...(id ? { id } : {}),
      address,
      cores: cores.map((c) => +c.id),
      user: { email, permissionId: +permission.id },
    };
    return lawyer;
  }
}
