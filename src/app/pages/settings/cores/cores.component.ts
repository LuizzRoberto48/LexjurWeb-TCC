import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SettingsComponent } from '../settings.component';
import { MatDialog } from '@angular/material/dialog';
import { CoresFormComponent } from './cores-form/cores-form.component';
import { CoreService } from 'app/modules/cores/service/core.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { configDialog, configDialogResource } from 'app/modules/process/utils';
import { NotificationService } from '@fuse/components/notification/notification.service';

@Component({
  //Mudar para cores se possível (Está como core)(profile.helper.ts)
  selector:'settings-core',
  templateUrl: './cores.component.html',
  styleUrls: ['./cores.component.scss']
})

export class SettingsCoresComponent implements AfterViewInit, OnInit{
  displayedColumns: string[] = ['name', 'description', 'action'];
  coresDataSource: MatTableDataSource<any> = new MatTableDataSource();
  length = 0;
  pageSizeOptions = [12, 24, 36];

  cores: any[]
  id: number

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.coresDataSource.paginator = this.paginator;
  }

  constructor(
    public dialog: MatDialog,
    private settingsComponent: SettingsComponent,
    private coreService: CoreService,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService
  ){}

  ngOnInit(){
    this.listCores();
  }

  //TODO: Migrar para tela dedicada de núcleos
  createCore(): void {
   const dialogRef = this.dialog.open(CoresFormComponent, {
      width: '40rem',
    });
    this.dialogClose(dialogRef)
  }

  dialogClose(dialogRef: any){
    dialogRef.afterClosed().subscribe({
      next:()=>{
        this.listCores()
      }
    })
  }

  goToTeam(panel: string, item: any): void {
    const {id, name} = item
    this.coreService.updateLocalStorage({id, name});
    this.settingsComponent.goToPanel(panel);
  }

  editCore(item: any): void {
    const dialogRef = this.dialog.open(CoresFormComponent, {
      width: '40rem',
      data: item
    });
    this.dialogClose(dialogRef)
  }

  removeCore(id: number){
    this.__confirmationService.open(configDialogResource()).afterClosed().subscribe({
      next:(res: any)=>{
        if (res == 'confirmed'){
          this.remove(id)
        }
      }
    })
  }
  //TODO: Migrar para tela dedicada de núcleos
  remove(id: number){
    this.coreService.remove(id).subscribe({
      next: (res: any)=>{
        this.listCores();
        this.notification.success('Removido com sucesso');
      }
    })
  }

  listCores(){
    this.coreService.getCoresByUser().subscribe({
      next:(res: any)=>{
        this.coresDataSource.data = res
      }
    })
  }
}
