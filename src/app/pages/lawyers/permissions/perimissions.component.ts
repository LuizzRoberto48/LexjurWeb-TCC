import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SearchService } from '@components/search/search.service';
import { PERMISSIONLIST, UserPermission } from 'app/modules/user-permissions/user-permission.model';
import { UserPermissionsService } from 'app/modules/user-permissions/user-permissions.service';
import { ProfilePanel } from 'app/modules/user/profile/models/panel.model';
import { PERMISSIONID } from 'app/modules/user/profile/profile-helper';
import { UserService } from 'app/modules/user/user.service';
import { Subscription, filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-perimissions',
  templateUrl: './perimissions.component.html',
})
export class LawyerPermissionsComponent {
  isOpened = false;
  infoPage: ProfilePanel;
  searchInputControl: FormControl = new FormControl();
  subs: Subscription[] = [];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private userService: UserService,
    private userPermission: UserPermissionsService,
    private _router: Router,
    private searchService: SearchService,
  ) {}

  ngOnInit() {
    this.changeSearchControl();
    this.getRouterEvents();
  }

  changeSearchControl() {
    this.searchInputControl.valueChanges.subscribe({
      next: (v) => {
        this.searchService.changeSearchInput(v);
      },
    });
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

  get isListPage() {
    return this.infoPage.id != PERMISSIONLIST ? false : true;
  }

  getPanels(id: string) {
    const up = new UserPermission();
    this.infoPage = up.panels.find((p) => p.id == id);
  }

  newPermission(): void {
    this._router.navigate(['./new'], {
      relativeTo: this._activatedRoute,
    });
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
