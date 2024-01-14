import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { SettingsComponent } from '../settings/settings.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { CoresFormComponent } from './cores-form/cores-form.component';

@Component({
  //Mudar para cores se possível (Está como core)(profile.helper.ts)
  selector:'settings-core',
  templateUrl: './cores.component.html',
  styleUrls: ['./cores.component.scss']
})

export class SettingsCoresComponent implements AfterViewInit{
  /*TABLE*/
  displayedColumns: string[] = ['name', 'description', 'action'];
  dataSource = new MatTableDataSource<CoresTable>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  /*TABLE*/

  /*FORM*/
   constructor(
    public dialog: MatDialog
  ){}
  /*FORM*/

  /*DIALOG*/
  createCore(): void {
    const dialogRef = this.dialog.open(CoresFormComponent, {
    });
  }

  editCore(){

  }

  removeCore(){

  }
  /*DIALOG*/
  /*Change to team*/
  @ViewChild('drawer') drawer: MatDrawer;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  panels: any[] = [];
  selectedPanel: string = 'team';
  toTeam(panel: string): void {
    this.selectedPanel = panel;
    if (this.drawerMode === 'over') this.drawer.close();
  }
}

/*TABLE*/
export interface CoresTable {
  name: string;
  description: string;
}

const ELEMENT_DATA: CoresTable[] = [
  {name: 'Lexjur', description: 'Desenvolvedores'},
  {name: 'Administradores', description: 'Administradores'},
  {name: 'Advogados', description: 'Advogados'},
  {name: 'Estagiários', description: 'Estagiários'},

];
/*TABLE*/
