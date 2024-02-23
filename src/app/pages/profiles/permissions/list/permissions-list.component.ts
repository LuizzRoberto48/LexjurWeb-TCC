import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { GetUserPermission } from 'app/modules/user-permissions/user-permission.model';
import { UserPermissionsService } from 'app/modules/user-permissions/user-permissions.service';
import { ProfilePanel } from 'app/modules/user/profile/models/panel.model';
import { PERMISSIONID } from 'app/modules/user/profile/profile-helper';
import { UserService } from 'app/modules/user/user.service';

@Component({
  selector: 'permissions-list',
  templateUrl: './permissions-list.component.html',
})
export class PermissionsListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() onEditPermission: EventEmitter<GetUserPermission> =
    new EventEmitter();
  infoPage: ProfilePanel;
  allPermissions: GetUserPermission[];
  pagePermissions: GetUserPermission[];

  pageSizeOptions: number[] = [10, 15, 20];
  totalItems = 0;
  pageSize = 10; // Default page size
  pagedItems = [];
  constructor(
    private userService: UserService,
    private userPermissionService: UserPermissionsService,
    private cdr: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.infoPage = this.userService.panels.find(
      (info) => info.id == PERMISSIONID,
    );
    this.list();
  }

  list() {
    this.userPermissionService.findAll().subscribe({
      next: (items: GetUserPermission[]) => {
        this.allPermissions = items;
        this.totalItems = items.length;
        this.updatePagedItems();
      },
    });
  }

  editPermission(permission: GetUserPermission) {
    this._router.navigate([`./edit/${permission.id}`], {
      relativeTo: this._activatedRoute,
    });
  }

  updatePagedItems() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagePermissions = this.allPermissions.slice(startIndex, endIndex);

    this.cdr.detectChanges();
  }

  onPageChange() {
    this.updatePagedItems();
  }
 
}
