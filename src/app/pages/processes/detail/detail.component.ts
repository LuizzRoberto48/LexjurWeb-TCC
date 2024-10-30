import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute} from '@angular/router';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ProcessDetailService } from 'app/modules/process/services/process-detail.service';
import { ProcessService } from 'app/modules/process/services/process.service';
import { Subject, takeUntil } from 'rxjs';

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
  currentPanel: string = ''

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
    this.setCurrentPanel();
  }

  setCurrentPanel(): void {
    let route = this.activeRoute.firstChild;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    route?.title.subscribe(data => {
      this.currentPanel = data
      this._changeDetectorRef.detectChanges();
    });
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
