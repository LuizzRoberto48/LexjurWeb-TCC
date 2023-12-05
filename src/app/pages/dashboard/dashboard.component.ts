import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ProcessService } from 'app/modules/process/process.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'example',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy {
    $subs:Subscription = new Subscription();
    $countProcess:Observable<number>

  constructor(private processService: ProcessService) {}

  ngOnInit(): void {
    this.$countProcess = this.processService.getProcessCount();
  }

  /*  get processCount():Observable<number> {
        return this.processService.getProcessCount();
    } */

  ngOnDestroy(): void {
    this.$subs.unsubscribe()
  }
}
