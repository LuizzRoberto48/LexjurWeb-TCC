import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cores-form',
  templateUrl: './cores-form.component.html',
  styleUrls: ['./cores-form.component.scss']
})
export class CoresFormComponent {
  constructor(
    private _formBuilder: UntypedFormBuilder,
  ){}
  accountForm: UntypedFormGroup;

  showOnScreen(core: any){
    this.accountForm.get('name').setValue(core.name)
    this.accountForm.get('description').setValue(core.description)
  }

  ngOnInit(): void {
    this.accountForm = this._formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
}