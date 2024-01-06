import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Ufs, UfsModel } from 'app/global/utils/get-ufs';
import { AuthService } from 'app/modules/auth/auth.service';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import { CreateLawyer, Person } from 'app/modules/lawyer/model/lawyer.model';

@Component({
  selector: 'settings-account',
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit {
  ufs: UfsModel[] = Ufs;

  accountForm: UntypedFormGroup;
  lawyer: any;

  constructor(
    private _formBuilder: UntypedFormBuilder, private lawyerService: LawyerService, public authService: AuthService
  ){

  }

  update(){
    const id = this.authService.authUser.sub
    this.lawyerService.update(id, this.accountForm.value).subscribe(res=>{console.log(res);},error=>{console.log(error)})
  }

  findById(){
    const id = this.authService.authUser.sub
    this.lawyerService.findById(id).subscribe(res=>
      {
        this.showOnScreen(res)
      })
      
  }

  showOnScreen(lawyer: any){
        this.accountForm.get('name').setValue(lawyer.name)
        this.accountForm.get('oab').setValue(lawyer.oab)
        this.accountForm.get('postalCode').setValue(lawyer.postalCode)
        this.accountForm.get('city').setValue(lawyer.city)
        this.accountForm.get('district').setValue(lawyer.district)
        this.accountForm.get('street').setValue(lawyer.street)
        this.accountForm.get('number').setValue(lawyer.number)
        this.accountForm.get('complement').setValue(lawyer.complement)
        this.accountForm.get('uf').setValue(lawyer.uf)
        this.accountForm.get('ufOab').setValue(lawyer.ufOab)
  }
  
  ngOnInit(): void {
    this.authService.authUser
    // Create the form
    this.accountForm = this._formBuilder.group({
      name: ['', Validators.required],
      oab: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: ['', Validators.required],
      uf: ['', [Validators.required, Validators.minLength(2)]],
      ufOab: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.findById();
    console.log(this.lawyer);
  }

  ngOnView(){
    console.log(this.accountForm.value);
  }
}