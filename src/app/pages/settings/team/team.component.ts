import { Component } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { CoreSheedList } from "app/modules/cores/core-sheet/core-sheet.component";
import { CoreService } from "app/modules/cores/service/core.service";
import { Subscription } from "rxjs";

@Component({
    selector:'settings-team',
    templateUrl:'./team.component.html',
    styleUrls: ['./team.component.scss']
})

export class SettingsTeamComponent{
    members: any[];
    roles: any[];

    constructor(
        private _bottomSheet: MatBottomSheet,
        private coreService: CoreService
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
                email : 'dejesusmichael@mail.org',
                role  : 'administrador'
            },
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Mclaughlin Steele',
                email : 'mclaughlinsteele@mail.me',
                role  : 'lexjur'
            },
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Laverne Dodson',
                email : 'lavernedodson@mail.ca',
                role  : 'administrador'
            },
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Trudy Berg',
                email : 'trudyberg@mail.us',
                role  : 'read'
            },
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Lamb Underwood',
                email : 'lambunderwood@mail.me',
                role  : 'read'
            },
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Mcleod Wagner',
                email : 'mcleodwagner@mail.biz',
                role  : 'read'
            },
            {
                avatar: 'assets/images/avatars/blank-profile-picture.png',
                name  : 'Shannon Kennedy',
                email : 'shannonkennedy@mail.ca',
                role  : 'read'
            }
        ];

        // Setup the roles
        this.roles = [
            {
                label      : 'Read',
                value      : 'read',
                description: 'Can read and clone this repository. Can also open and comment on issues and pull requests.'
            },
            {
                label      : 'Administrador',
                value      : 'administrador',
                description: 'Can read, clone, and push to this repository. Can also manage issues and pull requests.'
            },
            {
                label      : 'Lexjur',
                value      : 'lexjur',
                description: 'Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.'
            }
        ];
    }

    ngOnDestroy() {
        this.$subsChangedCore.unsubscribe()
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}