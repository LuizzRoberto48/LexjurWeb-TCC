import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'settings-account',
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit {
  accountForm: UntypedFormGroup;


  constructor(
    private _formBuilder: UntypedFormBuilder
  ) {
  }

  ngOnInit(): void {
    // Create the form
    this.accountForm = this._formBuilder.group({
      name: ['Brian Hughes', Validators.required],
      oab: ['YXZ Software', Validators.required],
      email: ['hughes.brian@mail.com', [Validators.email, Validators.required]],
      postal_code: ['20543012', Validators.required],
      city: ['Rio de Janeiro', Validators.required],
      district: ['Tijuca', Validators.required],
      street: ['Rua Afonso Pena', Validators.required],
      number: ['12', Validators.required],
      complement: ['403', Validators.required],
      uf: ['RJ', [Validators.required, Validators.minLength(2)]],
      uf_oab: ['RJ', Validators.required],
      role_enum: ['LEXJUR', Validators.required]
      //LEXJUR
      //ADMIN
      //LAWYER
      //INTERN
    });
  }
}