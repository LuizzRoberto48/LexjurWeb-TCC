import { Component } from '@angular/core';

@Component({
  selector: 'complete-process-form',
  templateUrl: './complete-process-form.component.html',
  styleUrls: ['./complete-process-form.component.scss']
})
export class CompleteProcessFormComponent {



  btnClicked(event: boolean) {
    if (!event) return;
    //if (!this.form.valid) return;
    //this.data?.id ? this.update() : this.create();
  }
}
