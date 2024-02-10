import { Component, Input } from '@angular/core';
import { CoreService } from 'app/modules/cores/service/core.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'header-content',
  templateUrl: './header-content.component.html',
})
export class HeaderContentComponent {
  @Input() title: string;
  @Input() desc: string;
  @Input() titleIcon: string;
  @Input() descIcon: string;
  @Input() hasCoreBtn = false;
  coreName: string = '';
  $subsChangedCore: Subscription = new Subscription();

  constructor(private coreService: CoreService) {
    this.getCore();
  }

  getCore() {
    this.$subsChangedCore = this.coreService.$obsevableCore.subscribe((res) => {
      if (res?.id) {
        this.coreName = res.name;
      }
    });
  }
}
