import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { USERID } from 'app/modules/user/profile/profile-helper';
import { UserService } from 'app/modules/user/user.service';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
})
export class UsersComponent {
  infoPage;
  constructor(private userService: UserService) {
    this.infoPage = this.userService.panels.find((info) => info.id == USERID);
  }

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
}
