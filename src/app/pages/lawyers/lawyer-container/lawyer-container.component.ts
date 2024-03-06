import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DrawerService } from 'app/global/services/lawyer-drawer.service';
import { LAWYERNEDIT, Lawyer } from 'app/modules/lawyer/model/lawyer.model';
import { ProfilePanel } from 'app/modules/user/profile/models/panel.model';
import { USERID } from 'app/modules/user/profile/profile-helper';
import { UserService } from 'app/modules/user/user.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'lawyer-container',
  templateUrl: './lawyer-container.component.html',
})
export class LawyerContainerComponent {
  @ViewChild(MatDrawer) drawer: MatDrawer;
  private drawerSub: Subscription;
  infoPage: ProfilePanel;
  isOpened = false;
  constructor(
    private userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private drawerService: DrawerService,
  ) {
    this.infoPage = this.userService.panels.find((info) => info.id == USERID);
  }

  ngOnInit() {
    this.getRouterEvents()
  }

  ngAfterViewInit() {
    this.manipulateDrawer();
  }
  manipulateDrawer() {
    this.drawerSub = this.drawerService.getDrawerState().subscribe((isOpen) => {
      if (isOpen) {
        this.drawer.open();
      } else {
        this.drawer.close();
      }
    });
  }

  editOrCreateLaywer(id: any): void {
    if(!id) {
      this._router.navigateByUrl('lawyers/new')
      return;
    }
    this._router.navigate(['./detail', id], {
      relativeTo: this._activatedRoute,
    });
    this.drawer.open()
    this._changeDetectorRef.markForCheck();
  }

  getRouterEvents() {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let currentRoute = this._activatedRoute.root;
        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }
        currentRoute.data.subscribe((data) => {
          const { id } = currentRoute.snapshot.data;
          if (id) this.getPanels(id);
        });
      });

    // Trigger manually for initial load
    this.loadInitialRouteData();
  }

  loadInitialRouteData() {
    let currentRoute = this._activatedRoute.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    if (currentRoute.snapshot.data) {
      const { id } = currentRoute.snapshot.data;
      this.getPanels(id);
    }
  }

  getPanels(id: string) {
    const up = new Lawyer();
    this.infoPage = up.panels.find((p) => p.id == id);
  }

  onCloseDrawyer() {
    if(this.infoPage.id != LAWYERNEDIT)
      this._router.navigate(['/lawyers'])
  }

  ngOnDestroy(): void {
    this.drawerSub.unsubscribe();
  }
}
