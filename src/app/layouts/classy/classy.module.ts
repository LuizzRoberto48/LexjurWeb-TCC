import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { FuseFullscreenModule } from '@fuse/components/fullscreen/fullscreen.module';
import { NotificationsModule } from '@fuse/components/notifications/notifications.module';
import { SearchModule } from '@components/search/search.module';
import { ClassyLayoutComponent } from './classy.component';
import { GlobalModule } from 'app/shared/global.module';

import { LanguagesModule } from 'app/global/languages/languages.module';
import { MessagesModule } from '@fuse/components/messages/messages.module';
import { QuickChatModule } from '@fuse/components/quick-chat/quick-chat.module';
import { ShortcutsModule } from '@fuse/components/shortcuts/shortcuts.module';
import { UserActionsModule } from '@components/user-actions/user-actions.module';

@NgModule({
  declarations: [ClassyLayoutComponent],
  imports: [
    HttpClientModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    FuseFullscreenModule,
    FuseLoadingBarModule,
    FuseNavigationModule,
    LanguagesModule,
    MessagesModule,
    NotificationsModule,
    QuickChatModule,
    SearchModule,
    ShortcutsModule,
    UserActionsModule,
    GlobalModule,
  ],
  exports: [ClassyLayoutComponent],
})
export class ClassyLayoutModule {}
