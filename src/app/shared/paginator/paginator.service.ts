import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class MyPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = 'Itens por página'; // customize the label here
  /** A label for the button that increments the current page. */
  nextPageLabel = 'próxima';
  /** A label for the button that decrements the current page. */
  previousPageLabel = 'anterior';
  /** A label for the button that moves to the first page. */
  firstPageLabel = 'primeira';
  /** A label for the button that moves to the last page. */
  lastPageLabel = 'última';

  constructor() {
    super();
    this.changes.next()
  }


}