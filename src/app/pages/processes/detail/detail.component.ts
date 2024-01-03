import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ProcessDetailService } from 'app/modules/process/process-detail.service';
import { ProcessService } from 'app/modules/process/process.service';
import { BehaviorSubject, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

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
  currentPanel: FuseNavigationItem = {} as FuseNavigationItem

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    public processDetailService: ProcessDetailService,
    protected activeRoute: ActivatedRoute,
    private processService: ProcessService) {

    this.menuData = this.processDetailService.topics
  }

  ngOnInit() {
    this.hideOrShowDrawerBySizeOfScreen();
    this.getEditProcess()
  }

  getEditProcess() {
    this.activeRoute.data.subscribe({
      next: ({ data }) => {
        this.processService.memoryProcess = data;
      }
    })
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

  activatedRoute($event) {
    $event._activatedRoute?.title.pipe(
      switchMap((res: any) => of(this.processDetailService.getItemById(res)))
    ).subscribe(res => {
      this.currentPanel = res
    })
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
