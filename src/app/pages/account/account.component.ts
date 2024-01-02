import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  accountForm: UntypedFormGroup;

  constructor(
    private _formBuilder: UntypedFormBuilder, private lawyerService: LawyerService, private authService: AuthService
  ){

  }

  update(){
    const id = this.authService.authUser.sub
    this.lawyerService.update(id, this.accountForm.value).subscribe(res=>{console.log(res);},error=>{console.log(error)})
  }
  
  ngOnInit(): void {
    this.authService.authUser
    // Create the form
    this.accountForm = this._formBuilder.group({
      //id:[this.authService.authUser.sub],
      name: ['Brian Hughes', Validators.required],
      oab: ['YXZ Software', Validators.required],
      //email: ['hughes.brian@mail.com', [Validators.email, Validators.required]],
      postalCode: ['20543012', Validators.required],
      city: ['Rio de Janeiro', Validators.required],
      district: ['Tijuca', Validators.required],
      street: ['Rua Afonso Pena', Validators.required],
      number: ['12', Validators.required],
      complement: ['403', Validators.required],
      uf: ['RJ', [Validators.required, Validators.minLength(2)]],
      ufOab: ['RJ', [Validators.required, Validators.minLength(2)]],
      //roleEnum: ['LEXJUR', Validators.required]
      
      //LEXJUR
      //ADMIN
      //LAWYER
      //INTERN
    });
    console.log(this.authService.authUser);
  }

  ngOnView(){
    console.log(this.accountForm.value);
  }


}