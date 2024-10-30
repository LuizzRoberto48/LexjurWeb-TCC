import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'app/modules/auth/auth.service';
import { CoreService } from 'app/modules/cores/service/core.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, delay } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@fuse/components/notification/notification.service';

@Component({
  selector: 'app-cores-form',
  templateUrl: './cores-form.component.html',
  styleUrls: ['./cores-form.component.scss']
})
export class CoresFormComponent implements OnInit{
  constructor(
    private _formBuilder: UntypedFormBuilder, 
    private coreService: CoreService, 
    public authService: AuthService,
    private notification: NotificationService,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ){}
  
  actionName = 'Criar Núcleo';
  accountForm: UntypedFormGroup;
  core: any;

  send(){
    this.data?.id ? this.update() : this.create()
  }
  
  create(): void {
    this.coreService.create(this.accountForm.value).subscribe({
      next: () => {
        this.notification.success('Núcleo criado com sucesso');
      }
    });
  }

  update(){
    const id = this.data.id
    this.coreService.update(id, this.accountForm.value).subscribe(res=>{
      this.notification.success('Núcleo editado com sucesso');
    },error=>{
      console.log(error)
    })
  }

  isEdit(core: any){
    if (this.data?.id){
      this.showOnScreen(core)
      this.actionName='Editar Núcleo';
    }
  }

  showOnScreen(core: any){
    this.accountForm.get('name').setValue(core.name)
    this.accountForm.get('description').setValue(core.description)
  }

  ngOnInit(): void {
    this.authService.authUser
    this.accountForm = this._formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
    this.isEdit(this.data)
    /*setTimeout(() => {
      this.findById();
    }, 0);*/
  }
}