import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, forkJoin, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GetFeature,
  GetRole,
  PermissionFeatureService,
  PermissionRoleService,
  UserPermissionsService,
} from 'app/modules/user-permissions';
import { NotificationService } from '@fuse/components/notification/notification.service';
import {
  CreateUserPermission,
  GetUserPermission,
} from 'app/modules/user-permissions/user-permission.model';

@Component({
  selector: 'user-permission-form',
  templateUrl: './user-permission-form.component.html',
  styleUrls: ['./user-permission-form.component.scss'],
})
export class UserPermissionFormComponent {
  @ViewChildren('filterInputRole') filterInputRole: QueryList<ElementRef>;
  form: FormGroup;

  selectedRoles: GetRole[] = [];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<GetRole[]>;
  subscriptions: Subscription[] = [];

  features: GetFeature[] = [];
  roles: GetRole[] = [];
  filteredRoles = [];

  isEdit = false;

  constructor(
    private userPermission: UserPermissionsService,
    private permissionFeature: PermissionFeatureService,
    private permissionRole: PermissionRoleService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private notification: NotificationService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.joinList();
  }

  joinList() {
    forkJoin({
      features: this.listFeatures(),
      roles: this.listRoles(),
    }).subscribe({
      next: () => {
        this.editPermissionInfo();
      },
    });
  }

  listFeatures() {
    // Return the observable instead of subscribing here.
    return this.permissionFeature.findAll().pipe(
      tap((features: GetFeature[]) => {
        this.features = features;
        this.features.map((f) => (f.roles = []));
      }),
    );
  }

  listRoles() {
    // Return the observable instead of subscribing here.
    return this.permissionRole.findAll().pipe(
      tap((roles: GetRole[]) => {
        this.roles = roles;
        this.filteredRoles = [...this.roles];
      }),
    );
  }

  filterRole(event: any): void {
    const query = event.target.value.toLowerCase();
    this.filteredRoles = this.roles.filter((role) =>
      role.label.toLowerCase().includes(query),
    );
  }

  clearInputField(index: number): void {
    const inputElement = this.filterInputRole.toArray()[index]?.nativeElement;
    if (inputElement) inputElement.value = ''; // Clear the input field
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', { validators: [Validators.required] }),
      desc: new FormControl(''),
      permissionFeatures: new FormArray([this.createFeature()]),
    });
  }

  createFeature(): FormGroup {
    return new FormGroup({
      name: new FormControl('', { validators: [Validators.required] }),
      role: new FormArray([]),
    });
  }

  createRole(): FormGroup {
    return new FormGroup({
      id: new FormControl('', { validators: [Validators.required] }),
      label: new FormControl('', { validators: [Validators.required] }),
      name: new FormControl('', { validators: [Validators.required] }),
    });
  }

  removeFeature(i: number) {
    if (this.formFeatures.length > 1) {
      this.formFeatures.removeAt(i);
    }
  }

  addFeature(): void {
    const lastFeatureSize = this.formFeatures.controls.length - 1;
    const lastFeature = this.formFeatures.controls[lastFeatureSize].value.name;
    const formRole = this.formFeatures.controls[lastFeatureSize].get(
      'role',
    ) as FormArray;

    if (formRole.length && lastFeature)
      this.formFeatures.push(this.createFeature());
  }

  get formFeatures(): FormArray {
    return this.form.get('permissionFeatures') as FormArray;
  }

  editPermissionInfo() {
    const subs = this._activatedRoute.data.subscribe({
      next: ({ data }) => {
        if (data) {
          this.isEdit = true;
          this.filldataToForm(data);
        }
      },
    });
    this.subscriptions.push(subs);
  }

  filldataToForm(data: GetUserPermission) {
    const permissionFeatures: any[] = this.transformToFormObj(data);
    this.form.controls['name'].setValue(data.name);
    this.form.controls['desc'].setValue(data.description);
    const formPermissions = this.form.controls[
      'permissionFeatures'
    ] as FormArray;

    permissionFeatures.forEach((pf, i) => {
      formPermissions.controls[i].get('name').setValue(pf.name);
      pf.role.forEach((r) => {
        this.addRole(r, i);
      });
      if(i == permissionFeatures.length -1) return;
      this.addFeature();
    });
  }

  transformToFormObj(permission: GetUserPermission) {
    const featuresMap = permission.permissionFeatures.reduce(
      (acc, { feature, role }) => {
        if (!acc[feature.id]) {
          acc[feature.id] = {
            name: +feature.id,
            role: [],
          };
        }
        acc[+feature.id].role.push(role);
        return acc;
      },
      {},
    );
    // Convert the map to the desired array structure
    return (permission.permissionFeatures = Object.values(featuresMap));
  }

  addRole(obj: any, featureIndex: number): [] {
    const roleObj = obj;
    const formRole: FormArray = this.formFeatures
      .at(featureIndex)
      .get('role') as FormArray;

    const foundRole = this.roles.find((role) => role.id == roleObj.id);
    if (!foundRole) return;

    const isExits = formRole.controls.find(
      (control) => control.value.id == foundRole.id,
    );
    if (isExits) return;

    this.addCreatedRole(formRole, foundRole);

    /* Ao filtrar as roles é preciso resetar o input digitado e listar novamente todas as roles */
    this.clearInputField(featureIndex);
    this.filteredRoles = [...this.roles];
  }

  addCreatedRole(formRole, obj: GetRole) {
    formRole.push(this.createRole());
    formRole.controls[formRole.controls.length - 1].setValue({
      id: obj.id ?? '',
      name: obj.name ?? '',
      label: obj.label ?? '',
    });
  }

  getRolesControl(index: number): FormArray {
    return this.formFeatures.at(index).get('role') as FormArray;
  }

  submitForm() {
    const obj = this.formToObj();
    this.isEdit ? this.update(obj) : this.create(obj);
  }

  update(obj: CreateUserPermission) {
    //obj.id = this.dat
    this.userPermission.create(obj).subscribe({
      next: () => {
        this.notification.success('Permissão criada com sucesso');
        this._router.navigate(['../'], {
          relativeTo: this._activatedRoute,
        });
      },
    });
  }

  create(obj: CreateUserPermission) {
    this.userPermission.create(obj).subscribe({
      next: () => {
        this.notification.success('Permissão criada com sucesso');
        this._router.navigate(['../'], {
          relativeTo: this._activatedRoute,
        });
      },
    });
  }

  formToObj() {
    const { permissionFeatures, ...obj } = this.form.value;
    const transformed = {
      name: obj.name,
      description: obj.desc,
      permissionFeatures: [],
    };
    permissionFeatures.forEach((feature) => {
      feature.role.forEach((role) => {
        transformed.permissionFeatures.push({
          featureId: feature.name,
          roleId: role.id,
        });
      });
    });
    return transformed;
  }

  removeRole(role: FormGroup, index: number): void {
    const indexToRemove = this.getRolesControl(index).controls.indexOf(role);
    if (indexToRemove >= 0) {
      this.getRolesControl(index).controls.splice(indexToRemove, 1);
    }
  }

  selected(event: any, i: number): void {
    this.addRole(event.option, i);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
