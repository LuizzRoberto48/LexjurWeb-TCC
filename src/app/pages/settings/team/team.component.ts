import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { AuthService } from 'app/modules/auth/auth.service';
import { CoreService } from 'app/modules/cores/service/core.service';
import { LawyerService } from 'app/modules/lawyer/lawyer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'settings-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class SettingsTeamComponent {
  @Output() openDrawer = new EventEmitter<any>();
  @Output() lawyerInfo = new EventEmitter<any>();

  lawyers = [] as any;
  pageSizeOptions = [12, 24, 36];

  constructor(
    private coreService: CoreService,
    public authService: AuthService,
    private lawyerService: LawyerService,
  ) {}

  $subsChangedCore: Subscription = new Subscription();
  coreName: string;

  ngOnInit(): void {
    this.$subsChangedCore = this.coreService.$obsevableCore.subscribe((res) => {
      this.coreName = res?.name;
      this.findLawyersByCore(res.id);
    });
  }

  findLawyersByCore(id: number) {
    this.lawyerService.findLawyersByCore(id).subscribe({
      next: (lawyers) => {
        this.lawyers = lawyers;
      },
    });
  }

  drawerActions(value: any, lawyer: any) {
    this.openDrawer.emit(value);
    this.getLawyerInfo(lawyer.id);
  }

  getLawyerInfo(id: number) {
    this.lawyerService.findById(id).subscribe({
      next: (lawyer) => {
        this.lawyerInfo.emit(lawyer);
      }
    })
  }
}
