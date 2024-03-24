import { Injectable } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'app/modules/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService, private _router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let newReq = req.clone();
    if (this._authService.accessToken) {
      newReq = req.clone({
        headers: req.headers.set(
          'Authorization',
          `Bearer ${this._authService.accessToken}`,
        ),
      });
    }
    // Response
    return next.handle(newReq).pipe(
      catchError((error) => {
        
        if (error.error.statusCode === 401) {
          this._authService.signOut();
          this._router.navigateByUrl('/sign-in');
        }
        return throwError(() => error);
      }),
    );
  }
}

export const AuthInterceptorsProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
