import { ChangeDetectorRef, Component } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { AuthService } from "app/modules/auth/auth.service";
import { CoreSheedList } from "app/modules/cores/core-sheet/core-sheet.component";
import { CoreService } from "app/modules/cores/service/core.service";
import { LawyerService } from "app/modules/lawyer/lawyer.service";
import { Subject, Subscription, takeUntil } from "rxjs";

@Component({
    selector:'settings-team',
    templateUrl:'./team.component.html',
    styleUrls: ['./team.component.scss']
})

export class SettingsTeamComponent{
    showFiller = false;
    members: any[];
    roles: any[];

    constructor(
        private _bottomSheet: MatBottomSheet,
        private coreService: CoreService,
        public authService: AuthService,
        private lawyerService: LawyerService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ){}

    $subsChangedCore: Subscription = new Subscription()
    coreName: string

    ngOnInit(): void
    {
        this.$subsChangedCore = this.coreService.$obsevableCore.subscribe(res => {
            this.coreName = res?.name
        })

        // Setup the team members
        this.members = [
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Dejesus Michael',
                email : this.authService.authUser.email,
                role  : 'administrador'
            },
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Dejesus Michael',
                email : this.authService.authUser.email,
                role  : 'administrador'
            },
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Dejesus Michael',
                email : this.authService.authUser.email,
                role  : 'administrador'
            },
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Dejesus Michael',
                email : this.authService.authUser.email,
                role  : 'administrador'
            },
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Dejesus Michael',
                email : this.authService.authUser.email,
                role  : 'administrador'
            },
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Dejesus Michael',
                email : this.authService.authUser.email,
                role  : 'administrador'
            },
        ];

        // Setup the roles
        this.roles = [
            {
                label      : 'Read',
                value      : 'read',
                description: 'Pode le'
            },
            {
                label      : 'Create',
                value      : 'create',
                description: 'Pode cria'
            },
            {
                label      : 'Delete',
                value      : 'delete',
                description: 'pode deleta'
            },
            {
                label      : 'Update',
                value      : 'update',
                description: 'Pode altera'
            },
            {
                label      : 'Full',
                value      : 'full',
                description: 'Porra toda'
            },
        ];
        
    }

    ngOnDestroy() {
        this.$subsChangedCore.unsubscribe()
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

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
}