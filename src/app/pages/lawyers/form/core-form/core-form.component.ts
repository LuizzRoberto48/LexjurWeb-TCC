import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Core } from 'app/modules/cores/model/get-core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { LawyerFormService } from 'app/modules/lawyer/lawyer-form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lawyer-core-form',
  templateUrl: './core-form.component.html',
})
export class LawyerCoreFormComponent {
  form: FormGroup;
  cores: Core[] = [];
  subs: Subscription = new Subscription();

  constructor(
    private laywerForm: LawyerFormService,
    private coreService: CoreService,
  ) {
    laywerForm.getLocalStorage('coreInfoForm');
    this.findCores();
  }

  ngOnInit() {
    this.form = this.laywerForm.coreForm;
    this.formChangeEvent();
  }

  formChangeEvent() {
    this.subs = this.form.valueChanges.subscribe((value) => {
      if (this.form.valid) this.save();
    });
  }

  save() {
    this.laywerForm.setLocalStorage(this.form.value, 'coreInfoForm');
  }

  findCores() {
    this.coreService.getAll().subscribe({
      next: (cores: Core[]) => {
        this.cores = cores;
      },
    });
  }

  selectChange(event: MatSelectChange) {
    const found = this.cores.filter((c) => event.value.includes(c.id));
    this.laywerForm.setLocalStorage(found, 'selectedCoresObj');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
