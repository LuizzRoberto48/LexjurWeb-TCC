import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

const recentTransactions = [
  {
    id: 1,

    name: '528651571NT',
    date:'2019-10-07T22:22:37.274Z',
    phase: 'Morgan Page',
    eletronic_system: +1358.75,
    object: 'completed',
    area: 'teste era',
    instance:'teste',
    number_case:'7923743324',
    old_number_case:'7979074090340-',
    isCNJ:true
  },
  {
    id: 2,
    name: '528651571NT',
    date: '2019-10-07T22:22:37.274Z',
    phase: 'Morgan Page',
    eletronic_system: +1358.75,
    object: 'completed',
    area: 'teste area',
    instance:'teste',
    number_case:'7923743324',
    old_number_case:'7979074090340-',
    isCNJ:true
  },
  {
    id: 3,
    name: '528651571NT',
    date: '2019-10-07T22:22:37.274Z',
    phase: 'Morgan Page',
    eletronic_system: +1358.75,
    object: 'completed',
    area: 'teste',
    instance:'teste',
    number_case:'7923743324',
    old_number_case:'7979074090340-',
    isCNJ:true
  },
  {
    id: 4,
    name: '528651571NT',
    date: '2019-10-07T22:22:37.274Z',
    phase: 'Morgan Page',
    eletronic_system: +1358.75,
    object: 'completed',
    area: 'teste',
    instance:'teste',
    number_case:'7923743324',
    old_number_case:'7979074090340-',
    isCNJ:true
  }
]

@Component({
  selector: 'app-form-process',
  templateUrl: './list-process.component.html',
})
export class ListProcessComponent {

  recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  recentTransactionsTableColumns: string[] = ['name','date' ,'phase', 'eletronic_system', 'object', 'area', 'instance', 'number_case', 'old_number_case', 'isCNJ'];

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  constructor(private route:Router) { }

  ngOnInit() {
    this.recentTransactionsDataSource.data = recentTransactions
  }
  
  newProcess() {
    this.route.navigate(['processos/new'])
  }
}
