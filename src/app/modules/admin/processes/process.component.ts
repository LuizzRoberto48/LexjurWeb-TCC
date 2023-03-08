import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { CoreService } from 'app/core/cores/service/core.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-processes',
  templateUrl: './process.component.html',
})
export class ProcessComponent implements OnInit {
  $subsChangedCore: Subscription = new Subscription()
  coreName: string = ''
  constructor(public route: Router, public coreService: CoreService,) { }

  ngOnInit() {
    this.$subsChangedCore = this.coreService.$obsevableCore.subscribe(res => {
      this.coreName = res?.name
    })
  }

  

  ngOnDestroy() {
    this.$subsChangedCore.unsubscribe()
  }
}
