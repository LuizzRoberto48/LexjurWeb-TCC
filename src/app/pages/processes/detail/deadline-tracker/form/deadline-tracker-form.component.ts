import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'schedule-form',
  templateUrl: './deadline-tracker-form.component.html',
})
export class DeadlineTrackerFormComponent {
  dialogTitle: string = 'Cadastre um prazo para o seu processo';
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    processNumber: new FormControl('', { validators: [Validators.required] }),
    subtype: new FormControl('', { validators: [Validators.required] }),
    manager: new FormControl('', { validators: [Validators.required] }),
    internDeadline: new FormControl('', { validators: [Validators.required] }),
    criticalDeadline: new FormControl(''),
    hour:new FormControl(''),
    local:new FormControl(''),
    note:new FormControl('')
  });
  constructor() {}

  btnClicked(event: any) {
    console.log(event);
  }
}
