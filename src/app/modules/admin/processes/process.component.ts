import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

interface SelectTab {
  name: string,
  path: string
}

@Component({
  selector: 'app-processes',
  templateUrl: './process.component.html',
})
export class ProcessComponent implements OnInit {

  items: SelectTab[] = [{
    name: 'Listar',
    path: 'processos'
  },
  {
    name: 'Cadastrar',
    path: 'processos/new'
  }];

  currentItem: SelectTab = this.items[0]

  constructor(private route: Router) { }

  ngOnInit() {
    //this.changeItem(this.currentItem)
  }

  newProcess() {
    this.route.navigate(['processos/new'])
  }

  changeItem(selected: SelectTab) {
    this.currentItem = selected
    this.route.navigate([selected.path])

  }
}
