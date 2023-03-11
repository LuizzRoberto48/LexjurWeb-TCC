import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ProcessDetailService } from 'app/core/process/process-detail.service';
import { map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'process-detail',
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessDetailComponent {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  drawerOpened: boolean;
  menuData: FuseNavigationItem[];
  panels: any[] = [];
  selectedPanel: string = 'account';
  currentPanel: Observable<any>

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private processDetailService: ProcessDetailService,
    private activeRoute: ActivatedRoute) {

    this.menuData = this.processDetailService.topics
  }

  changePanel() {
    //this.processDetailService.$obsevablePanel = 
    this.activeRoute.children
    this.activeRoute.children[0].title.pipe(
      switchMap(res=> of(this.processDetailService.getItemById(res)))).subscribe(console.log)
     
  }

  

  ngOnInit() {
    this.changePanel()
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
