import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { ProfilePanel } from 'app/modules/user/profile/models/panel.model';
import { PERMISSIONID } from 'app/modules/user/profile/profile-helper';
import { UserService } from 'app/modules/user/user.service';

@Component({
  selector: 'app-permissions-list',
  templateUrl: './permissions-list.component.html',
})
export class PermissionsListComponent {
  infoPage: ProfilePanel;
  constructor(private userService: UserService) {
    this.infoPage = this.userService.panels.find(
      (info) => info.id == PERMISSIONID,
    );
  }
  filteredLabels;
  members = [
    {
      name: 'Dejesus Michael',
      desc: 'Dono da porra toda',
    },
    {
      name: 'Dejesus Michael',
      desc: 'Dono da porra toda',
    },
    {
      name: 'Dejesus Michael',
      desc: 'Dono da porra toda',
    },
    {
      name: 'Dejesus Michael',
      desc: 'Dono da porra toda',
    },
    {
      name: 'Dejesus Michael',
      desc: 'Dono da porra toda',
    },
    {
      name: 'Dejesus Michael',
      desc: 'Dono da porra toda',
    },
  ];

  filterLabels(event): void {
    // Get the value
    const value = event.target.value.toLowerCase();

    // Filter the labels
    this.labels = this.labels.filter((label) =>
      label.title.toLowerCase().includes(value),
    );
  }

  toggleProductTag(label: any, change: MatCheckboxChange): void {
    /* if (change.checked) {
      this.addLabelToCard(label);
    } else {
      this.removeLabelFromCard(label);
    } */
  }

  hasLabel(label: any): boolean {
    return !!this.labels.find((cardLabel) => cardLabel.id === label.id);
  }

  labels = [
    {
      id: 'e0175175-2784-48f1-a519-a1d2e397c9b3',
      boardId: '2c82225f-2a6c-45d3-b18a-1132712a4234',
      title: 'Research',
    },
    {
      id: '51779701-818a-4a53-bc16-137c3bd7a564',
      boardId: '2c82225f-2a6c-45d3-b18a-1132712a4234',
      title: 'Wireframing',
    },
    {
      id: 'e8364d69-9595-46ce-a0f9-ce428632a0ac',
      boardId: '2c82225f-2a6c-45d3-b18a-1132712a4234',
      title: 'Design',
    },
    {
      id: 'caff9c9b-a198-4564-b1f4-8b3df1d345bb',
      boardId: '2c82225f-2a6c-45d3-b18a-1132712a4234',
      title: 'Development',
    },
    {
      id: 'f9eeb436-13a3-4208-a239-0d555960a567',
      boardId: '2c82225f-2a6c-45d3-b18a-1132712a4234',
      title: 'Bug',
    },
  ];
}
