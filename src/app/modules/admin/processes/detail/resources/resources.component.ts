import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from 'app/layout/common/quick-chat/quick-chat.types';
import { Observable, of, Subject, Subscription, switchMap } from 'rxjs';

import { ResourceFormComponent } from '../resources/form/resource-form.component';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-process-resources',
  templateUrl: './resources.component.html'
})
export class ProcessResourcesComponent {

  @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

  contacts$: Observable<any[]>;

  contactsCount: number = 0;
  contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
  countries: any[];
  drawerMode: 'side' | 'over';
  searchInputControl: any = new UntypedFormControl();
  selectedContact: Contact;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor(public _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
   ) { }

  ngOnInit() {
  // Get the contacts
  this.contacts$ = new Observable();
  // Update the counts
  this.contactsCount = 0;

  // Mark for check
  this._changeDetectorRef.markForCheck();


  }

  dialogResource() {
    const dialogRef = this.dialog.open(ResourceFormComponent,{
      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }


  onBackdropClicked(): void {

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
