import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/modules/auth/auth.service';
import { CreateUserPassword } from 'app/modules/auth/models/create-user-password';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenInfo } from 'app/modules/auth/models/token-info';
import { DateTime } from 'luxon';
import { NotificationService } from '@fuse/components/notification/notification.service';

@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthResetPasswordComponent implements OnInit {
  @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
  token: string;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  resetPasswordForm: UntypedFormGroup;
  showAlert: boolean = false;

  constructor(
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,
  ) {
    this.token = this.route.snapshot.params.token;
  }

  ngOnInit(): void {
    this.tokenExpired(this.decodeToken(this.token).exp);
    // Create the form
    this.resetPasswordForm = this._formBuilder.group(
      {
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required],
      },
      {
        validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
      },
    );
  }

  decodeToken(token: string): TokenInfo {
    return this._authService.decodeUserToken(token);
  }

  createUserObj(token: string): CreateUserPassword {
    const createUser: CreateUserPassword = {} as CreateUserPassword;
    createUser.email = this.decodeToken(token).email;
    createUser.password = this.resetPasswordForm.get('password').value;
    createUser.id = this.decodeToken(token).sub;
    createUser.expToken = this.decodeToken(token).exp;
    createUser.token = token;
    return createUser;
  }

  tokenExpired(expToken: number) {
    if (this._authService.isTokenExpired(expToken)) {
      this.showAlert = true;
      this.alert = {
        type: 'error',
        message:
          'O token foi expirado. Envie outra solicitação de mudança de senha',
      };
    }
  }

  resetPassword(): void {
    this.resetPasswordForm.disable();
    this.showAlert = false;
    const createUserObj = this.createUserObj(this.token);
    this.tokenExpired(createUserObj.expToken);
    if (this.resetPasswordForm.invalid) return;

    this._authService
      .resendPassword(createUserObj)
      .pipe(
        finalize(() => {
          this.resetPasswordForm.enable();
          this.resetPasswordNgForm.resetForm();
          this.showAlert = true;
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success('Sua senha foi modificada com sucesso.');
          this.router.navigateByUrl('sign-in');
        }
      });
  }
}
