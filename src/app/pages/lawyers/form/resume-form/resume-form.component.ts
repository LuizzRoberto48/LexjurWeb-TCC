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
    const data = this.info?.cores;
 
    if (Array.isArray(data)) {
        return data.map((c: any) => c.name);
    }
   
    if (data && typeof data === 'object') {

        const list = (data as any).nucleos || (data as any).cores || (data as any).selectedCores;
        if (Array.isArray(list)) {
            return list.map((c: any) => c.name);
        }
    }

    return [];
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
    if (!this.info) {
      console.error('ERRO: this.info está vazio');
      return null;
    }

    const basic = this.info.basic || {} as any;
    const address = this.info.address || {} as any;

    const coresData = this.info.cores as any;

    let coresList = coresData && coresData.coreId ? coresData.coreId : coresData;

    if (!Array.isArray(coresList)) {
      coresList = [];
    }

    const permissionData = this.info.permission as any;
    const permId = permissionData ? (permissionData.permissionId || permissionData.id) : null;
    const { id, email, birthday, ...rest } = basic;
    const lawyer = {
      ...rest,
      ...(birthday ? { birthday } : {}),
      ...(id ? { id } : {}),
      address,
      
      cores: coresList.map((c: any) => (typeof c === 'object' ? +c.id : +c)),
      
      user: { 
        email, 
        permissionId: permId ? +permId : null 
      },
    };
    
    return lawyer;
  }
}
