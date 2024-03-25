import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/modules/user/user.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  @Output() openUser: EventEmitter<any> = new EventEmitter();
  constructor(
    private userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  members = [
    {
      avatar: 'assets/images/avatars/blank-profile-picture.png',
      name: 'Dejesus Michael',
      email: 'dejesusmichael@mail.org',
      role: 'administrador',
    },
    {
      avatar: 'assets/images/avatars/blank-profile-picture.png',
      name: 'Mclaughlin Steele',
      email: 'mclaughlinsteele@mail.me',
      role: 'lexjur',
    },
    {
      avatar: 'assets/images/avatars/blank-profile-picture.png',
      name: 'Laverne Dodson',
      email: 'lavernedodson@mail.ca',
      role: 'administrador',
    },
    {
      avatar: 'assets/images/avatars/blank-profile-picture.png',
      name: 'Trudy Berg',
      email: 'trudyberg@mail.us',
      role: 'read',
    },
    {
      avatar: 'assets/images/avatars/blank-profile-picture.png',
      name: 'Lamb Underwood',
      email: 'lambunderwood@mail.me',
      role: 'read',
    },
    {
      avatar: 'assets/images/avatars/blank-profile-picture.png',
      name: 'Mcleod Wagner',
      email: 'mcleodwagner@mail.biz',
      role: 'read',
    },
    {
      avatar: 'assets/images/avatars/blank-profile-picture.png',
      name: 'Shannon Kennedy',
      email: 'shannonkennedy@mail.ca',
      role: 'read',
    },
  ];

  editUser(user: any): void {
    this.openUser.emit(user);
  }
}
