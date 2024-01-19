import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { IProcessProgress } from 'app/modules/process-progress/models/progress.model';

@Component({
  selector: 'process-progress-info',
  templateUrl: './process-progress-info.component.html'
})
export class ProcessProgressInfoComponent {

  @Input() info:IProcessProgress;
  constructor(private location: Location){}

  ngOnInit() {
    
  }

  back() {
    this.location.back();
  }
}
