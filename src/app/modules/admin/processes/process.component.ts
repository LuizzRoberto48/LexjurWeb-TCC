import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'app/core/cores/service/core.service';


@Component({
  selector: 'app-processes',
  templateUrl: './process.component.html',
})
export class ProcessComponent implements OnInit {

  coreName: string = ''
  constructor(public route: Router, private coreService: CoreService) { }

  ngOnInit() {
    this.coreService.$localCore.subscribe(res => {
      this.coreName =res.name
    })

  }


}
