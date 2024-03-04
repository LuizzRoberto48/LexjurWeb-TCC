import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '@components/search/search.service';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { configDialogResource } from 'app/modules/process/utils';
import { GetUserPermission } from 'app/modules/user-permissions/user-permission.model';
import { UserPermissionsService } from 'app/modules/user-permissions/user-permissions.service';
import { ProfilePanel } from 'app/modules/user/profile/models/panel.model';
import { PERMISSIONID } from 'app/modules/user/profile/profile-helper';
import { UserService } from 'app/modules/user/user.service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'permissions-list',
  templateUrl: './permissions-list.component.html',
})
export class PermissionsListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() onEditPermission: EventEmitter<GetUserPermission> =
    new EventEmitter();
  infoPage: ProfilePanel;
  allPermissions: GetUserPermission[] = [];
  pagePermissions: GetUserPermission[] = [];
  filterPermissions: GetUserPermission[] = [];

  subs: Subscription[] = [];
  pageSizeOptions: number[] = [10];
  totalItems = 0;
  pageSize = 5; // Default page size
  pagedItems = [];
  constructor(
    private userService: UserService,
    private userPermissionService: UserPermissionsService,
    private cdr: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private __confirmationService: FuseConfirmationService,
    private notification: NotificationService,
    private searchService: SearchService,
  ) {}

  ngOnInit() {
    this.infoPage = this.userService.panels.find(
      (info) => info.id == PERMISSIONID,
    );
    this.list();
  }

  ngAfterViewInit() {
    this.applyFilters();
  }

  list() {
    this.userPermissionService.findAll().subscribe({
      next: (items: GetUserPermission[]) => {
        this.allPermissions = items;
        this.totalItems = items.length;
        this.updatePagedItems(items);
      },
    });
  }

  editPermission(permission: GetUserPermission) {
    this._router.navigate([`./edit/${permission.id}`], {
      relativeTo: this._activatedRoute,
    });
  }

  updatePagedItems(permissions: GetUserPermission[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagePermissions = permissions.slice(startIndex, endIndex);
    this.cdr.detectChanges();
  }

  removeDialog(process: GetUserPermission): void {
    const dialogRef = this.__confirmationService.open(configDialogResource());
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.remove(process.id);
      }
    });
  }

  remove(id: number) {
    this.userPermissionService.delete(id).subscribe({
      next: () => {
        this.notification.success('processo removido com sucesso');
        this.list();
      },
    });
  }

  applyFilters() {
    const subs = this.searchService.currentSearchInput.subscribe({
      next: (value) => {
        if (!value) {
          this.filterPermissions = [];
          this.paginator.pageIndex = 0;
          this.totalItems = this.allPermissions.length;
          this.updatePagedItems(this.allPermissions);
          return;
        }
        this.filterPermissions = this.allPermissions.filter(
          (p) =>
            p.name.toLowerCase().includes(value.toLowerCase()) ||
            p.description.toLowerCase().includes(value.toLowerCase()),
        );
        this.paginator.pageIndex = 0;
        this.totalItems = this.filterPermissions.length;
        this.updatePagedItems(this.filterPermissions);
      },
    });
    this.subs.push(subs);
  }

  onPageChange() {
    this.filterPermissions.length == 0
      ? this.updatePagedItems(this.allPermissions)
      : this.updatePagedItems(this.filterPermissions);
  }
}
