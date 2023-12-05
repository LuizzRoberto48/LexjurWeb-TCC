import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-processes',
  templateUrl: './process.component.html',
})
export class ProcessComponent {
  
  constructor(protected activeRoute: ActivatedRoute) { }


  ngOnInit() {
  }


}
