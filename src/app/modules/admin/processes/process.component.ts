import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-processes',
  templateUrl: './process.component.html',
})
export class ProcessComponent implements OnInit {

  constructor(public route: Router, private activeRoute:ActivatedRoute) { }

  ngOnInit() {
   
    console.log( this.route.url)
  }



  newProcess() {
    this.route.navigate(['processos/new'])
  }

}
