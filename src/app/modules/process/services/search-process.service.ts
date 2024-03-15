import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { CustomValidators } from 'app/global/forms/custom-validators';

@Injectable({
  providedIn: 'any',
})
export class SearchProcessService {
  filtersForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      caseNumber: new FormControl(''),
      uf: new FormControl(''),
      county: new FormControl(''),
      client: new FormControl(''),
      status: new FormControl(''),
      createAt: new FormControl(''),
      insideLawyerId: new FormControl(''),
      rangeDate: new FormGroup({
        startDate: new FormControl<Date | null>(null),
        endDate: new FormControl<Date | null>(null),
      }),
    },
    { validators: CustomValidators.atLeastNotEmptyValidator(1) },
  );

  constructor(private notification: NotificationService) {}

  changedId() {
    const id = this.filtersForm.controls['id'].value;
    /* TODO:change to all attributes in the filter form  disabled*/
    const controlsToToggle = ['caseNumber', 'uf', 'county', 'client'];
    controlsToToggle.forEach((controlName) => {
      id
        ? this.filtersForm.controls[controlName].disable()
        : this.filtersForm.controls[controlName].enable();
    });
  }

  validSearch() {
    if (!this.filtersForm.valid) {
      this.notification.waning('É preciso adicionar ao menos 1 filtro');
      return false;
    }
    return true;
  }
}
