import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'app/shared/material.module';
import { NotificationService } from './notification.service';

@NgModule({
  imports: [CommonModule, MaterialModule],
  providers: [NotificationService],
})
export class NotificationModule {}
