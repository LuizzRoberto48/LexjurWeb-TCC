import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { LJError } from 'app/core/global/errors/error.model';

@Component({
  selector: 'auth-forgot-password',
  templateUrl: './forgot-password.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit {
  @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  forgotPasswordForm: UntypedFormGroup;
  showAlert: boolean = false;

  constructor(
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder
  ) {
  }

  ngOnInit(): void {
    // Create the form
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendResetLink(): void {
    // Return if the form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.forgotPasswordForm.disable();
    this.showAlert = false;
    this._authService.forgotPassword(this.forgotPasswordForm.get('email').value)
      .pipe(
        finalize(() => {
          this.forgotPasswordForm.enable();
          this.forgotPasswordNgForm.resetForm();
          this.showAlert = true;
        })
      )
      .subscribe(
        {
          next: () => {
            this.alert = {
              type: 'success',
              message: 'Você receberá um e-mail para alterar sua senha.'
            };
          },
          error: (error) => {
            const pError:LJError = error.error
            this.alert = {
              type: 'error',
              message: pError.message
            };
          }
        }
      );
  }
}
