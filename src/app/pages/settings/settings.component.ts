import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {  Scheme, Theme } from 'app/global/config/app.config';
import { UserService } from 'app/modules/user/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  
  @ViewChild('drawer') drawer: MatDrawer;
  lawyerInfo = {} as any; 
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  drawerTeamOpened: boolean = false;
  panels: any[] = [];
  selectedPanel: string = 'account';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _router: Router,
    private _fuseConfigService: FuseConfigService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef) {
    this.panels = this.userService.panels
  }

  ngOnInit() {
    this.hideOrShowDrawerBySizeOfScreen()
  }

  hideOrShowDrawerBySizeOfScreen() {
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
          this.drawerOpened = true;
        }
        else {
          this.drawerMode = 'over';
          this.drawerOpened = false;
        }
        this._changeDetectorRef.markForCheck();
      });
  }

  goToPanel(panel: string): void {
    this.selectedPanel = panel;
    if (this.drawerMode === 'over') this.drawer.close();
  }

  getPanelInfo(id: string): any {
    return this.panels.find(panel => panel.id === id);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  setScheme(scheme: Scheme): void {
    this._fuseConfigService.config = { scheme };
  }

  setTheme(theme: Theme): void {
    this._fuseConfigService.config = { theme };
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  drawerOpen(value: any){
    this.drawerOpened = false;
    this.drawerTeamOpened = true;
  }

  drawerClose(){
    this.hideOrShowDrawerBySizeOfScreen();
    //this.drawerOpened = true;
    this.drawerTeamOpened = false;
  }

  getLawyerInfo(lawyer: any){
    this.lawyerInfo = lawyer;
  }
}
