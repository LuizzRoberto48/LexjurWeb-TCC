import { Component } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
    selector: 'details-component',
    templateUrl: './details.component.html'
})

export class DetailsComponent{
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
}