import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'schedule-form',
  templateUrl: './schedule-form.component.html',
})
export class ScheduleFormComponent {
  dialogTitle: string = 'Cadastre um agendamento para o seu processo';
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', { validators: [Validators.required] }),
  });
  constructor() {}

  btnClicked(event: any) {
    console.log(event)
  }
}
