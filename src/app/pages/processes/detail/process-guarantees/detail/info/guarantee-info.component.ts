import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { GetProcessGuarantee } from 'app/modules/process-guarantees/model/guarantees.model';

@Component({
  selector: 'process-guarantee-info',
  templateUrl: './guarantee-info.component.html',
})
export class ProcessGuaranteeInfoComponent {
  @Input() info: GetProcessGuarantee;
  constructor(private location: Location) {}

  ngOnInit() {}

  back() {
    this.location.back();
  }
}
