import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { AuthSignInComponent } from 'app/pages/auth/sign-in/sign-in.component';
import { authSignInRoutes } from 'app/pages/auth/sign-in/sign-in.routing';
import { CommonModule } from '@angular/common';
import { GlobalModule } from 'app/shared/global.module';

@NgModule({
    declarations: [
        AuthSignInComponent
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(authSignInRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        GlobalModule
    ]
})
export class AuthSignInModule
{
}
