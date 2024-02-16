import { Component, Input } from '@angular/core';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent {
  @Input() isInfo = true;
}
