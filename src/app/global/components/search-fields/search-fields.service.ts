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
      uf: new FormControl('--Selecione--'),
      county: new FormControl('--Selecione--'),
      client: new FormControl('--Selecione--'),
      processStatus: new FormControl('--Selecione--'),
      deadlineStatus: new FormControl('--Selecione--'),
      deadlineTypeId: new FormControl('--Selecione--'),
      deadlineSubTypeId: new FormControl('--Selecione--'),
      //createAt: new FormControl(''),
      insideLawyerId: new FormControl('--Selecione--'),
      rangeDate: new FormGroup({
        startDate: new FormControl<Date | null>(null),
        endDate: new FormControl<Date | null>(null),
      }),
      rangeDateInternDeadline: new FormGroup({
        startInternDate: new FormControl<Date | null>(null),
        endInternDate: new FormControl<Date | null>(null),
      }),
    },
    { validators: CustomValidators.atLeastNotEmptyValidator(1) },
  );

  constructor(private notification: NotificationService) {}

  changedId() {
    const id = this.filtersForm.get('id').value;

    // Define which controls should be reset to '--Selecione--' when `id` has a value
    const selectControls = [
      'uf',
      'county',
      'client',
      'status',
      'insideLawyerId',
    ];

    // Iterate over all form controls except 'id'
    Object.keys(this.filtersForm.controls).forEach((controlName) => {
      const control = this.filtersForm.get(controlName);

      if (controlName !== 'id') {
        // Skip 'id' control
        if (id) {
          // Reset select controls to '--Selecione--', others to their default value
          const resetValue = selectControls.includes(controlName)
            ? '--Selecione--'
            : '';
          control.reset(resetValue);
          control.disable();
        } else {
          control.enable();
        }
      }
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
