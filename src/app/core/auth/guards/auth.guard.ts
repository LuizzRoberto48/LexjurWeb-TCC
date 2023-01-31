import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanMatch {
  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {
  }

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._check(segments);
  }

  private _check(segments: UrlSegment[]): Observable<boolean | UrlTree> {
    // Check the authentication status
    return this._authService.check().pipe(
      switchMap((authenticated) => {
       
        // If the user is not authenticated...
        if (!authenticated) {    
          const urlTree = this._router.parseUrl('/sign-in');
          return of(urlTree);
        }

        // Allow the access
        return of(true);
      })
    );
  }
}
