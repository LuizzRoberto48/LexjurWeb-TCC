import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/modules/auth/auth.service';
import { UserPermissionsService } from 'app/modules/user-permissions';
import { finalize } from 'rxjs';

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit {
  @ViewChild('signInNgForm') signInNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  signInForm: UntypedFormGroup;
  showAlert: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private userPermission: UserPermissionsService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [true],
    });
  }

  signIn(): void {
    if (this.signInForm.invalid) {
      return;
    }

    this.signInForm.disable();
    this.showAlert = false;

    this._authService
      .signIn(this.signInForm.value)
      .pipe(
        finalize(() => {
          this.signInForm.enable();
          this.signInNgForm.resetForm();
          this.showAlert = true;
        }),
      )
      .subscribe({
        next: (res: any) => {
          const redirectURL =
            this._activatedRoute.snapshot.queryParamMap.get('dashboard') ||
            '/dashboard';
          this._router.navigateByUrl(redirectURL);
          this.userPermission.findFeatsAndRolesByCurrentUser();
        },
        error: (err: any) => {
          console.log(err)
          /* primeiro acesso, enviar solicitação de troca de senha */
          if (err.statusCode == 406) {
            this.firstAcessToChangePassword();
          }
          this.alert = {
            type: 'error',
            message: err.message,
          };
        },
      });
  }

  firstAcessToChangePassword() {
    this._authService
      .forgotPassword(this.signInForm.get('email').value, true)
      .subscribe({
        next: (res: { expToken: string }) => {
          console.log(res)
          this._router.navigateByUrl(`sign-in/reset-password/${res.expToken}`);
        },
      });
  }
}
