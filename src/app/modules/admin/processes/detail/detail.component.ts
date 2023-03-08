import { AfterContentChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { LawyerService } from 'app/core/lawyer/lawyer.service';
import { Process } from 'app/core/process/models/process.model';
import { ProcessService } from 'app/core/process/process.service';
import { delay, first, map, Observable, of, startWith, Subject, takeLast, takeUntil, tap } from 'rxjs';

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
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService) {

    this.menuData = [
      {
        id: 'other-components.common',
        title: 'Common',
        subtitle: 'Custom made high-level components',
        type: 'group',
        children: [
          {
            id: 'other-components.common.overview',
            title: 'Overview',
            type: 'basic',
            link: '/ui/other-components/common/overview'
          },
          {
            id: 'other-components.common.languages',
            title: 'Languages',
            type: 'basic',
            link: '/ui/other-components/common/languages'
          },
          {
            id: 'other-components.common.messages',
            title: 'Messages',
            type: 'basic',
            link: '/ui/other-components/common/messages'
          },
          {
            id: 'other-components.common.notifications',
            title: 'Notifications',
            type: 'basic',
            link: '/ui/other-components/common/notifications'
          },
        ]
      },
      {
        id: 'other-components.divider-1',
        type: 'divider'
      },
      
    ];
  }

  getPanelInfo(id: string): any {
    return this.panels.find(panel => panel.id === id);
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
